-- Drop table

-- DROP TABLE public.foldersattributes;

CREATE TABLE public.foldersattributes (
	folder varchar(16) NOT NULL,
	"attribute" int4 NOT NULL,
	"name" varchar(32) NULL,
	CONSTRAINT foldersattributes_pk PRIMARY KEY (folder, attribute),
	CONSTRAINT foldersattributes_fk FOREIGN KEY (folder) REFERENCES folders(code),
	CONSTRAINT foldersattributes_fk_1 FOREIGN KEY (attribute) REFERENCES attributes(code)
);

