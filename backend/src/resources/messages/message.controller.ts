import express, { Request, Response } from "express";
import { dbClient } from "../../config/database";
import { authenticationMiddleware } from "../../middleware/authentication.middleware";
import { validationMiddleware } from "../../middleware/validation.middleware";
import { CreateConversationDto, SendMessageDto } from "./dto/message.dto";
import { teacherAuthenticationMiddleware } from "../../middleware/teacherAuthentication.middleware";

export const messageController = express.Router();

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

// Delete a message
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