-- Drop table

-- DROP TABLE public.foldersattributes;

CREATE TABLE public.folders_attributes (
	folder varchar(16) NOT NULL,
	"attribute_code" int4 NOT NULL,
	"attribute_name" varchar(32) NULL,
	CONSTRAINT folders_attributes_pk PRIMARY KEY (folder, attribute),
	CONSTRAINT folders_attributes_fk FOREIGN KEY (folder) REFERENCES folders(code),
	CONSTRAINT folders_attributes_fk_1 FOREIGN KEY (attribute) REFERENCES attributes(code)
);

