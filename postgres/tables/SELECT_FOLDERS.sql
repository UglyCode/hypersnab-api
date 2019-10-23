SELECT folders.code, folders.folder_name as folder, parents.folder_name as parent
FROM public.folders as folders
inner join public.folders as parents
	on folders.parent = parents.code
order by parents.code	
;
