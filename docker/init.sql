-- Enable UUID extension if not already enabled (gen_random_uuid is native in pg 13+, but uuid-ossp is good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User Table
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Log Game Table
CREATE TABLE IF NOT EXISTS log_game (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    response_time INTEGER NOT NULL, -- in seconds
    wrong_answer_count INTEGER NOT NULL,
    hint_count INTEGER NOT NULL,
    play_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Analytical Results Table
CREATE TABLE IF NOT EXISTS analytical_results (
    analytic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id UUID NOT NULL REFERENCES log_game(log_id) ON DELETE CASCADE,
    pattern_found TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data for testing purposes
INSERT INTO "user" (id, name, created_at) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Adit', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Chika', CURRENT_TIMESTAMP - INTERVAL '1 days');

INSERT INTO log_game (log_id, user_id, response_time, wrong_answer_count, hint_count, play_time) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 45, 0, 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 85, 3, 4, CURRENT_TIMESTAMP - INTERVAL '1 days'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 30, 1, 0, CURRENT_TIMESTAMP - INTERVAL '1 days');

INSERT INTO analytical_results (analytic_id, log_id, pattern_found, recommendation, analyzed_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Sangat Memahami Materi', 'Pertahankan prestasimu! Cobalah tantangan game lain yang lebih sulit.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Membutuhkan Bimbingan Tambahan', 'Jangan menyerah! Gunakan Panduan Guru atau tonton Video Cerita untuk belajar lebih lanjut sebelum mencoba kuis lagi.', CURRENT_TIMESTAMP - INTERVAL '1 days'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Memahami Sebagian Materi', 'Bagus! Sedikit latihan lagi untuk mendapatkan skor sempurna.', CURRENT_TIMESTAMP - INTERVAL '1 days');

