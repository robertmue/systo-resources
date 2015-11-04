Robert Muetzelfeldt, 3 Sept 2015

See this discussion on StackOverflow regarding merging (and minifying) several Javascript files:
http://stackoverflow.com/questions/5511989/combine-multiple-javascript-files-into-one-js-file

The main reasons for doing this are:
- to minimise startup time: one HTTP request in place of several;
- to simplify Systo examples and coding of new Systo pages: reduce number of <script> elements.

I use mergejs: https://github.com/eloone/mergejs

I had tried cat, but:
- it doesn't preserve order, and this is important for the core files; and
- mergejs allwos you to comment out (single #, no space) files you don't want included.

Installation: I placed the downloaded mergejs file into /usr/local/bin, then did 
sudo chmod o+wx mergejs
You can now type the command mergejs anywhere, as advertised.

The format is
mergejs FILELIST.txt OUTPUT.js
where 
  FILELIST.txt is the path to the text file listing the .js files to be merged; and
  OUTPUT.js is the merged .js file.
See github readme for more options

Current mergejs_file_list files:
- mergejs_file_list_core.txt:      core Systo code plus libraries (jquery etc)
- mergejs_file_list_plugins.txt    plugins (currently only simulation code generators_
- mergejs_file_list_widgets.txt:   Systo widgets

I've made a bash script to simplify re-merging all Systo files.    This is a handy short-cut to avoid having to type the mergejs command in full each time I change an individual .js file.  It's admin/merge_all, and is invoked by:#
  cd systo-resources/admin
  ./merge_all




