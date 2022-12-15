Looking _into_ the files was never a priority, but since I started tackling
with xdg `.desktop` files, it started to be a painful point - so this is the place
where one can modify the final list of items (hence the name: post parsing hooks)...

...but it raises some really nasty questions, like caching, cache invalidation
(based on file mtime?), processing speed, file access paralellization (pools or batches),
performance, showing the "not-really-the-filename" in the lister...
