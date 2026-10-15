CREATE TABLE projects (id TEXT PRIMARY KEY, title TEXT NOT NULL, goal TEXT NOT NULL, concurrency INTEGER NOT NULL DEFAULT 4, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE tasks (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), title TEXT NOT NULL, description TEXT NOT NULL, role TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ready', dependencies TEXT NOT NULL DEFAULT '[]', owner TEXT, lease_hash TEXT, lease_until INTEGER, result TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX tasks_project ON tasks(project_id, status);
--> statement-breakpoint
CREATE TABLE evidence (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), task_id TEXT REFERENCES tasks(id), title TEXT NOT NULL, url TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '', author TEXT NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE events (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), message TEXT NOT NULL, actor TEXT NOT NULL, created_at INTEGER NOT NULL);
