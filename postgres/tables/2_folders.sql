-- Drop table

-- DROP TABLE public.folders;

CREATE TABLE public.folders (
	code varchar(16) NOT NULL,
	"name" varchar(128) NOT NULL,
	parent varchar(16) NULL,
	CONSTRAINT folders_pk PRIMARY KEY (code)
);
