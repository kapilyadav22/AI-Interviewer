-- Add columns for structured ratings and topics
alter table interviews 
add column ratings jsonb,
add column topics text[];

-- Example of what data will look like:
-- ratings: { "technical": 8, "communication": 7, "problem_solving": 9 }
-- topics: ['Dynamic Programming', 'System Design', 'React']
