select goods.code as code, 
folders.folder_name as folder, 
goods.description as description, 
goods.measure as measure, 
goods.sort as sort, 
prices.price as price,
prices.spec as spec,
stock.stock as quantity
	from public.goods as goods
left join   public.folders as folders
	on goods.folder = folders.code
left join public.prices as prices
	on goods.code = prices.good
left join public.stock as stock
	on goods.code = stock.good
;
