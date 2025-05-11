import express, { Request, Response } from "express";
import { dbClient } from "../../config/database";
import { authenticationMiddleware } from "../../middleware/authentication.middleware";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { CreateConversationDto, SendMessageDto } from "./dto/message.dto";
import { teacherAuthenticationMiddleware } from "../../middleware/teacherAuthentication.middleware";

export const messageController = express.Router();

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     description: Retrieves a list of all conversations that the authenticated user is a participant in.
 *     tags:
 *       - Conversations
 *     responses:
 *       200:
 *         description: A list of conversations with details including participants and last message.
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
messageController.get("/conversations", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    try {
        const result = await dbClient.query(`
            SELECT 
                c.id, 
                c.title, 
                (
                    SELECT json_agg(json_build_object(
                        'id', u.id,
                        'first_name', u.first_name,
                        'last_name', u.last_name
                    ))
                    FROM conversation_participants cp
                    JOIN users u ON cp.user_id = u.id
                    WHERE cp.conversation_id = c.id
                ) AS participants,
                (
                    SELECT json_build_object(
                        'id', m.id,
                        'content', m.content,
                        'created_at', m.created_at,
                        'sender', json_build_object(
                            'id', u.id,
                            'first_name', u.first_name,
                            'last_name', u.last_name
                        )
                    )
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    WHERE m.conversation_id = c.id
                    ORDER BY m.id DESC
                    LIMIT 1
                ) AS last_message
            FROM conversations c
            JOIN conversation_participants cp ON c.id = cp.conversation_id
            WHERE cp.user_id = $1
        `, [req.userId]);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).send({ error: "Internal server error", details: err });
    }
});

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Get a specific conversation
 *     description: Retrieves detailed information about a specific conversation, including messages.
 *     tags:
 *       - Conversations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the conversation to retrieve.
 *     responses:
 *       200:
 *         description: The conversation details with all messages.
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: The user is not a participant in this conversation.
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Internal server error
 */
messageController.get("/conversations/:id", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const { id } = req.params;

    try {
        const participantCheck = await dbClient.query(`
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = $1 AND user_id = $2
        `, [id, req.userId]);

        if (participantCheck.rowCount === 0) {
            res.status(403).send({ error: "You are not a participant in this conversation" });
            return;
        }

        const conversationResult = await dbClient.query(`
            SELECT 
                c.id, 
                c.title, 
                c.created_at,
                (
                    SELECT json_agg(json_build_object(
                        'id', u.id,
                        'first_name', u.first_name,
                        'last_name', u.last_name
                    ))
                    FROM conversation_participants cp
                    JOIN users u ON cp.user_id = u.id
                    WHERE cp.conversation_id = c.id
                ) AS participants
            FROM conversations c
            WHERE c.id = $1
        `, [id]);

        if (conversationResult.rowCount === 0) {
            res.status(404).send({ error: "Conversation not found" });
            return;
        }

        const messagesResult = await dbClient.query(`
            SELECT 
                m.id, 
                m.content, 
                m.created_at,
                json_build_object(
                    'id', u.id,
                    'first_name', u.first_name,
                    'last_name', u.last_name
                ) AS sender
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
        `, [id]);

        const conversation = {
            ...conversationResult.rows[0],
            messages: messagesResult.rows
        };

        res.json(conversation);
    } catch (err) {
        console.error("Error fetching conversation:", err);
        res.status(500).send({ error: "Internal server error", details: err });
    }
});

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create a new conversation
 *     description: Creates a new conversation between a teacher and a student. Only authenticated teachers can create a conversation.
 *     tags:
 *       - Conversations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the conversation.
 *               studentId:
 *                 type: integer
 *                 description: The ID of the student to add to the conversation.
 *     responses:
 *       201:
 *         description: The created conversation details.
 *       400:
 *         description: Bad request, student does not exist.
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only teachers can create a conversation.
 *       500:
 *         description: Internal server error
 */
messageController.post("/conversations", authenticationMiddleware, teacherAuthenticationMiddleware ,validationMiddleware(CreateConversationDto), async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const { title, studentId } = req.body;
    const teacherId = req.userId;

    try {
        const userCheck = await dbClient.query(`
            SELECT id FROM users WHERE id = $1
        `, [studentId]);

        if (userCheck.rowCount !== 1) {
            res.status(400).send({ error: "Student does not exist" });
            return;
        }

        const client = await dbClient.connect();
        try {
            await client.query('BEGIN');

            const existingConvoCheck = await client.query(`
                SELECT cp1.conversation_id 
                FROM conversation_participants cp1
                JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
                WHERE cp1.user_id = $1 AND cp2.user_id = $2
                GROUP BY cp1.conversation_id
            `, [teacherId, studentId]);
            
            let conversationId;
            if (existingConvoCheck.rowCount !== null && existingConvoCheck.rowCount > 0) {
                // Use existing conversation
                conversationId = existingConvoCheck.rows[0].conversation_id;
                
                if (title) {
                    await client.query(`
                        UPDATE conversations
                        SET title = $1
                        WHERE id = $2
                    `, [title, conversationId]);
                }
            } else {
                const conversationResult = await client.query(`
                    INSERT INTO conversations (title)
                    VALUES ($1)
                    RETURNING id
                `, [title]);
                
                conversationId = conversationResult.rows[0].id;

                await client.query(`
                    INSERT INTO conversation_participants (conversation_id, user_id)
                    VALUES ($1, $2), ($1, $3)
                `, [conversationId, teacherId, studentId]);
            }

            await client.query('COMMIT');

            const conversationDetails = await dbClient.query(`
                SELECT 
                    c.id, 
                    c.title, 
                    c.created_at,
                    (
                        SELECT json_agg(json_build_object(
                            'id', u.id,
                            'first_name', u.first_name,
                            'last_name', u.last_name
                        ))
                        FROM conversation_participants cp
                        JOIN users u ON cp.user_id = u.id
                        WHERE cp.conversation_id = c.id
                    ) AS participants
                FROM conversations c
                WHERE c.id = $1
            `, [conversationId]);

            res.status(201).json(conversationDetails.rows[0]);
        } catch (txnErr) {
            await client.query('ROLLBACK');
            throw txnErr;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error creating conversation:", err);
        res.status(500).send({ error: "Internal server error", details: err });
    }
});

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message in a conversation
 *     description: Sends a message in an existing conversation. The user must be a participant of the conversation.
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *               conversationId:
 *                 type: integer
 *                 description: The ID of the conversation to send the message in.
 *     responses:
 *       201:
 *         description: The sent message details with the sender's information.
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: The user is not a participant in the conversation.
 *       500:
 *         description: Internal server error
 */
messageController.post("/messages", authenticationMiddleware, validationMiddleware(SendMessageDto), async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const { content, conversationId } = req.body;

    try {
        const participantCheck = await dbClient.query(`
            SELECT 1 FROM conversation_participants
            WHERE conversation_id = $1 AND user_id = $2
        `, [conversationId, req.userId]);

        if (participantCheck.rowCount === 0) {
            res.status(403).send({ error: "You are not a participant in this conversation" });
            return;
        }

        const client = await dbClient.connect();
        try {
            await client.query('BEGIN');

            const messageResult = await client.query(`
                INSERT INTO messages (conversation_id, sender_id, content)
                VALUES ($1, $2, $3)
                RETURNING id, content, created_at
            `, [conversationId, req.userId, content]);

            await client.query('COMMIT');

            const userResult = await dbClient.query(`
                SELECT id, first_name, last_name
                FROM users
                WHERE id = $1
            `, [req.userId]);

            const messageWithSender = {
                ...messageResult.rows[0],
                sender: userResult.rows[0]
            };

            res.status(201).json(messageWithSender);
        } catch (txnErr) {
            await client.query('ROLLBACK');
            throw txnErr;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).send({ error: "Internal server error", details: err });
    }
});

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     description: Deletes a message by its ID. The user must be the sender of the message to delete it.
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the message to delete.
 *     responses:
 *       200:
 *         description: Message deletion confirmation.
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
messageController.delete("/messages/:id", authenticationMiddleware, async (req: Request, res: Response) => {
    if (!req.userId) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    const { id } = req.params;

    try {
        const messageCheck = await dbClient.query(`
            SELECT sender_id, conversation_id FROM messages
            WHERE id = $1
        `, [id]);

        if (messageCheck.rowCount === 0) {
            res.status(404).send({ error: "Message not found" });
            return;
        }

        await dbClient.query(`
            DELETE FROM messages
            WHERE id = $1
        `, [id]);

        res.json({ success: true, messageId: id });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).send({ error: "Internal server error", details: err });
    }
});