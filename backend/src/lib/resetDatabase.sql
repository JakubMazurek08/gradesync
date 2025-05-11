DROP TABLE IF EXISTS schools, users, teachers, students, courses, students_courses, assignments , grades, days, admins, conversations, conversation_participants, messages cascade;

CREATE TABLE schools
(
    id        serial primary key,
    name      varchar not null,
    timetable varchar,
    createdAt timestamp default current_timestamp
);

CREATE TABLE users
(
    id         serial primary key,
    school_id  bigint references schools (id),
    login      varchar not null,
    password   varchar not null,
    email      varchar not null,
    first_name varchar not null,
    last_name  varchar not null,
    created_at timestamp default current_timestamp
);

CREATE TABLE admins
(
    id      serial primary key,
    user_id bigint references users (id)
);

CREATE TABLE teachers
(
    id         serial primary key,
    user_id    bigint references users (id),
    created_at timestamp default current_timestamp
);

CREATE TABLE students
(
    id         serial primary key,
    user_id    bigint references users (id),
    created_at timestamp default current_timestamp
);

CREATE TABLE courses
(
    id          serial primary key,
    course_name varchar not null,
    teacher_id  bigint references teachers (id),
    schools_id  bigint references schools (id),
    start_year  int     NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::int,
    end_year    int     NOT NULL DEFAULT (EXTRACT(YEAR FROM CURRENT_DATE)::int + 5),
    created_at  timestamp        default current_timestamp
);

CREATE TABLE students_courses
(
    student_id bigint references students (id),
    course_id  bigint references courses (id)
);

CREATE TABLE grades
(
    id          serial primary key,
    value       int     not null,
    title       varchar not null,
    category    varchar not null,
    description varchar,
    student_id  bigint references students (id),
    course_id   bigint references courses (id),
    created_at  timestamp default current_timestamp
);

CREATE TABLE assignments
(
    id          serial primary key,
    course_id   bigint references courses (id),
    title       varchar not null,
    category    varchar not null,
    description varchar,
    date        date    not null,
    lesson_hour int     not null,
    created_at  timestamp default current_timestamp
);

CREATE TABLE days
(
    id              serial primary key,
    lesson_hour     int not null,
    course_id       bigint references courses (id),
    day_of_the_week int not null
);

CREATE TABLE conversations
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants
(
    conversation_id BIGINT REFERENCES conversations (id) ON DELETE CASCADE,
    user_id         BIGINT REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages
(
    id              SERIAL PRIMARY KEY,
    conversation_id BIGINT REFERENCES conversations (id) ON DELETE CASCADE,
    sender_id       BIGINT REFERENCES users (id) ON DELETE SET NULL,
    content         TEXT   NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO schools (name, timetable)
VALUES ('Technischools',
        '8:55-9:40;9:45-10:30;10:35-11:20;11:25-12:10;12:35-13:20;13:45-14:30;14:35-15:20;15:25-16:10');

INSERT INTO users (first_name, last_name, email, login, password, school_id)
VALUES ('Piotr', 'Brodzik', 'piotrbrodzik@gmail.com', 'Piotr',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Sebastian', 'Mysakowski', 'sebastianmysakowski@gmail.com', 'Sebastian',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Jakub', 'Mazurek', 'jakubmazurek@gmail.com', 'Jakub',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Jakub', 'Lesniak', 'jakublesniak@gmail.com', 'Jakub',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Michal', 'Kastracki', 'michalkastracki@gmail.com', 'Michal',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvu, 1RK', 1),
       ('Slawek', 'Kruszynski', 'slawekkruszynski@gmail.com', 'Slawek',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Kamil', 'Zieliński', 'kamilzielinski@gmail.com', 'Kamil',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Sebastian', 'Tyda', 'sebastiantyda@gmail.com', 'Sebastian',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Marcin', 'Stefanowicz', 'marcinstefanowicz@gmail.com', 'Marcin',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Marta', 'Nowak', 'martanowak@gmail.com', 'Marta',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Oskar', 'Kurzyna', 'oskarkurzyna@gmail.com', 'Oskar',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Adam', 'Pukaluk', 'adampukaluk@gmail.com', 'Adam',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Konrad', 'Klautzsch', 'konradklautzsch@gmail.com', 'Konrad',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Marceli', 'Karman', 'marcelikarman@gmail.com', 'Marceli',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Tomasz', 'Nowicki', 'tomasznowicki@gmail.com', 'Tomasz',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Anna', 'Lewandowska', 'annalewandowska@gmail.com', 'Anna',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Robert', 'Wilk', 'robertwilk@gmail.com', 'Robert',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Natalia', 'Lis', 'natalialis@gmail.com', 'Natalia',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Daniel', 'Nowak', 'danielnowak@gmail.com', 'Daniel',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Agata', 'Kowalska', 'agatakowalska@gmail.com', 'Agata',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Krzysztof', 'Wrona', 'krzysztofwrona@gmail.com', 'Krzysztof',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Ewa', 'Zając', 'ewazajac@gmail.com', 'Ewa', '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Laura', 'Kowalczyk', 'laurakowalczyk@gmail.com', 'Laura',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Mateusz', 'Duda', 'mateuszduda@gmail.com', 'Mateusz',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Zofia', 'Kaczmarek', 'zofiakaczmarek@gmail.com', 'Zofia',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Lena', 'Sikora', 'lenasikora@gmail.com', 'Lena',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Pawel', 'Wójcik', 'pawelwojcik@gmail.com', 'Pawel',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Karolina', 'Michalak', 'karolinamichalak@gmail.com', 'Karolina',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Tomasz', 'Baran', 'tomaszbaran@gmail.com', 'TomaszB',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Maja', 'Gorska', 'majagorska@gmail.com', 'Maja',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Jakub', 'Witkowski', 'jakubwitkowski@gmail.com', 'JakubW',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1),
       ('Emilia', 'Nowicka', 'emilianowicka@gmail.com', 'Emilia',
        '$2b$10$jlMerNtOtWcVh6Hs.CEUceHjNy41OxWQTpP91SEDrHpR7YAiTvuRK', 1);



INSERT INTO teachers (user_id)
VALUES (1),
       (2),
       (7),
       (8),
       (9),
       (10),
       (15),
       (16),
       (17),
       (18),
       (19),
       (20),
       (21),
       (22);

INSERT INTO students (user_id)
VALUES (3),
       (4),
       (5),
       (6),
       (11),
       (12),
       (13),
       (14),
       (23),
       (24),
       (25),
       (26),
       (27),
       (28),
       (29),
       (30),
       (31),
       (32);

INSERT INTO courses (course_name, teacher_id, schools_id)
VALUES ('Mathematics', 1, 1),
       ('PAI', 2, 1),
       ('Programing basics', 5, 1),
       ('Git', 3, 1),
       ('Java', 4, 1),
       ('History', 6, 1),
       ('Biology', 7, 1),
       ('Chemistry', 8, 1),
       ('Physics', 9, 1),
       ('Geography', 10, 1),
       ('PE', 11, 1),
       ('Music', 12, 1),
       ('Art', 13, 1),
       ('Computer Science', 14, 1);

INSERT INTO courses (course_name, teacher_id, schools_id, start_year, end_year)
VALUES ('Mathematics', 1, 1, 2026, 2031);


INSERT INTO students_courses (student_id, course_id)
VALUES (1, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (5, 1),
       (6, 1),
       (7, 1),
       (8, 1),
       (1, 2),
       (2, 2),
       (3, 2),
       (4, 2),
       (5, 2),
       (6, 2),
       (7, 2),
       (8, 2),
       (1, 3),
       (2, 3),
       (3, 3),
       (4, 3),
       (5, 3),
       (6, 3),
       (7, 3),
       (8, 3),
       (1, 4),
       (2, 4),
       (3, 4),
       (4, 4),
       (5, 4),
       (6, 4),
       (7, 4),
       (8, 4),
       (1, 5),
       (2, 5),
       (3, 5),
       (4, 5),
       (5, 5),
       (6, 5),
       (7, 5),
       (8, 5),
       (1, 6),
       (2, 6),
       (3, 6),
       (4, 6),
       (5, 6),
       (6, 6),
       (7, 6),
       (8, 6),
       (8, 7),
       (8, 8),
       (8, 9),
       (8, 10),
       (8, 11),
       (8, 12),
       (8, 13),
       (8, 14),
       (9, 1),
       (10, 1),
       (11, 1),
       (12, 1),
       (13, 1),
       (14, 1),
       (15, 1),
       (16, 1),
       (17, 1),
       (18, 1);

INSERT INTO grades (value, title, category, student_id, course_id, description)
VALUES (83, 'Trigonometry', 'test', 3, 1, NULL),
       (83, 'Quadratic Equation', 'test', 3, 1, NULL),
       (83, 'Trigonometry', 'short_test', 3, 1, NULL),
       (90, 'Crud', 'test', 3, 2, NULL),
       (95, 'Algorithms', 'test', 3, 3, NULL),
       (80, 'Git', 'test', 3, 4, NULL),
       (90, 'Functions', 'test', 3, 5, NULL),
       (75, 'Renaissance', 'test', 3, 6, NULL),
       (90, 'Trigonometry', 'test', 4, 1, NULL),
       (90, 'Quadratic Equation', 'test', 4, 1, 'Very hard sprawdzian from Piotr Brodzik big sigma'),
       (70, 'Trigonometry', 'short_test', 4, 1, NULL),
       (95, 'Crud', 'test', 4, 2, NULL),
       (100, 'Algorithms', 'test', 4, 3, NULL),
       (90, 'Git', 'test', 4, 4, NULL),
       (94, 'Functions', 'test', 4, 5, NULL),
       (80, 'Renaissance', 'test', 4, 6, NULL),
       (90, 'Trigonometry', 'test', 5, 1, NULL),
       (60, 'Quadratic Equation', 'test', 5, 1, NULL),
       (77, 'Trigonometry', 'short_test', 5, 1, NULL),
       (75, 'Crud', 'test', 5, 2, NULL),
       (87, 'Algorithms', 'test', 5, 3, NULL),
       (99, 'Git', 'test', 5, 4, NULL),
       (85, 'Functions', 'test', 5, 5, NULL),
       (92, 'Renaissance', 'test', 5, 6, NULL),
       (60, 'Trigonometry', 'test', 6, 1, NULL),
       (70, 'Quadratic Equation', 'test', 6, 1, NULL),
       (98, 'Trigonometry', 'short_test', 6, 1, NULL),
       (90, 'Crud', 'test', 6, 2, NULL),
       (20, 'Algorithms', 'test', 6, 3, NULL),
       (50, 'Git', 'test', 6, 4, NULL),
       (64, 'Functions', 'test', 6, 5, NULL),
       (87, 'Renaissance', 'test', 6, 6, NULL),
       (10, 'Trigonometry', 'test', 7, 1, NULL),
       (14, 'Quadratic Equation', 'test', 7, 1, NULL),
       (25, 'Trigonometry', 'short_test', 7, 1, NULL),
       (35, 'Crud', 'test', 7, 2, NULL),
       (0, 'Algorithms', 'test', 7, 3, NULL),
       (10, 'Git', 'test', 7, 4, NULL),
       (30, 'Functions', 'test', 7, 5, NULL),
       (20, 'Renaissance', 'test', 7, 6, NULL),
       (0, 'Trigonometry', 'test', 8, 1, NULL),
       (5, 'Quadratic Equation', 'test', 8, 1, 'Very hard sprawdzian from Piotr Brodzik big sigma'),
       (9, 'Trigonometry', 'short_test', 8, 1, NULL),
       (15, 'Crud', 'test', 8, 2, NULL),
       (0, 'Algorithms', 'test', 8, 3, NULL),
       (20, 'Git', 'test', 8, 4, NULL),
       (4, 'Functions', 'test', 8, 5, NULL),
       (30, 'Renaissance', 'test', 8, 6, NULL),
       (70, 'Human body', 'test', 8, 7, NULL),
       (85, 'Chemical Reactions', 'test', 8, 8, NULL),
       (90, 'Newton Laws', 'short_test', 8, 9, NULL),
       (75, 'Continents and Oceans', 'test', 8, 10, NULL),
       (80, 'Endurance Run', 'test', 8, 11, NULL),
       (95, 'Music Theory', 'test', 8, 12, NULL),
       (88, 'Color Theory', 'short_test', 8, 13, NULL),
       (92, 'HTML Basics', 'test', 8, 14, NULL),
       (70, 'Trigonometry', 'test', 8, 1, NULL),
       (60, 'Quadratic Equation', 'test', 8, 1, NULL),
       (65, 'Trigonometry', 'short_test', 8, 1, NULL),
       (75, 'Crud', 'test', 8, 2, NULL),
       (55, 'Algorithms', 'test', 8, 3, NULL),
       (60, 'Git', 'test', 8, 4, NULL),
       (68, 'Functions', 'test', 8, 5, NULL),
       (70, 'Renaissance', 'test', 8, 6, NULL),
       (85, 'Human Body', 'test', 8, 7, NULL),
       (90, 'Chemical Reactions', 'test', 8, 8, NULL),
       (88, 'Newton Laws', 'short_test', 8, 9, NULL),
       (82, 'Continents and Oceans', 'test', 8, 10, NULL),
       (78, 'Endurance Run', 'test', 8, 11, NULL),
       (89, 'Music Theory', 'test', 8, 12, NULL),
       (93, 'Color Theory', 'short_test', 8, 13, NULL),
       (95, 'HTML Basics', 'test', 8, 14, NULL),
       (87, 'CSS Fundamentals', 'test', 8, 14, NULL),
       (91, 'JavaScript Basics', 'test', 8, 14, NULL),
       (76, 'World War II', 'test', 8, 6, NULL),
       (84, 'Fractions', 'short_test', 8, 1, NULL),
       (79, 'Loops', 'test', 8, 5, NULL),
       (88, 'Variables and Data Types', 'test', 8, 5, NULL),
       (92, 'Branches and Logic', 'test', 8, 5, NULL),
       (94, 'HTML Forms', 'short_test', 8, 14, NULL),
       (89, 'Environmental Issues', 'test', 8, 10, NULL),
       (86, 'Volcanoes and Earthquakes', 'test', 8, 10, NULL);


INSERT INTO assignments(course_id, lesson_hour, title, category, date)
VALUES (1, 2, 'Quadratic function', 'test', '2025-05-06'),
       (1, 3, 'Circle', 'pop quiz', '2025-06-10'),
       (2, 5, 'Status codes', 'pop quiz', '2025-06-29'),
       (3, 6, 'Classes and methods', 'test', '2025-05-27'),
       (3, 1, 'Project C++', 'project', '2025-06-05'),
       (4, 8, 'Diagrams', 'pop quiz', '2025-05-19'),
       (4, 3, 'UML', 'homework', '2025-06-11'),
       (5, 4, 'Lists', 'test', '2025-05-09'),
       (5, 6, 'Lists', 'homework', '2025-05-07'),
       (6, 7, 'French Revolution', 'homework', '2025-05-23'),
       (6, 2, 'Enlightenment', 'test', '2025-06-03');

insert into days (lesson_hour, course_id, day_of_the_week)
VALUES (1, 2, 0),
       (2, 2, 0),
       (3, 1, 0),
       (4, 4, 0),
       (5, 4, 0),
       (6, 14, 0),
       (7, 5, 0),
       (8, 5, 0),
       (1, 2, 1),
       (2, 2, 1),
       (3, 6, 1),
       (4, 7, 1),
       (5, 3, 1),
       (6, 3, 1),
       (7, 1, 1),
       (8, 1, 1),
       (1, 11, 2),
       (2, 11, 2),
       (3, 11, 2),
       (4, 13, 2),
       (5, 10, 2),
       (6, 10, 2),
       (1, 8, 3),
       (2, 1, 3),
       (3, 4, 3),
       (4, 2, 3),
       (5, 6, 3),
       (6, 5, 3),
       (7, 1, 3),
       (8, 2, 3),
       (2, 6, 4),
       (3, 6, 4),
       (4, 8, 4),
       (5, 3, 4),
       (6, 12, 4),
       (7, 6, 4),
       (8, 10, 4);

INSERT INTO admins(user_id)
VALUES (1);

INSERT INTO conversations (title)
VALUES ('Math feedback');

INSERT INTO conversation_participants (conversation_id, user_id)
VALUES (1, 1),
       (1, 14);


INSERT INTO messages (conversation_id, sender_id, content)
VALUES (1, 1, 'Sample text 1'),
       (1, 3, 'Sample text 2'),
       (1, 1, 'Sample text 3');