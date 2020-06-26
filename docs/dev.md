_Springald_ started out as an [nwjs](https://nwjs.io/) project; a quick and dirty hack to
give yourself a way to find files by using **words in an AND relation** against full path
filenames. That's all it can do.

Since you wanted to minimize memory usage, you used vanilla js, which 
does have a certain charm, but looks like dog poop. But hey, it works.

You used **nwjs**, because you thought it was more lightweight than **electron**.
You were wrong. You migrated this project to electron, because:

- nwjs versions are buggy
- global hotkeys did not work on gnome 3 (so you added a unix socket interface)
- sometimes the app in the most recent nwjs version froze for a minute or so (no logs whatsoever)
- nwjs logging is painful; in the end you wrote yourself a log listener
  and a dev launcher wrapper (that colored and formatted the stdout stream of nwjs)
- nwjs tray menu broke a year or so ago and it didn't work for you ever since
- nwjs tray icon sometimes disappeared or looked messy

> Btw you also gave **typescript** a try, because typescript is <3, but without robust
> bundling/building `require` and module `import/export` did not mix very well. In fact
> you probably should accept this project as a hack. You know react, vue, worked with
> angular, ngrx, redux, sagas - you can do better. But please don't.
> Go and read a book or watch a movie instead.

...so you migrated this mess to electron, because you still felt the need for this tool.
You saved the nwjs codebase in the **development-nwjs** branch. Along the migration things
that did not make it:

1. the log server (log listener); electron's dev toolbar works and 90% of the code is in the renderer section
2. the launch wrapper (not needed)
3. the unix socket interface: you hate gnome anyway, xorg and fluxbox are still around, so just forget gnome
4. the tray menu
5. windows and mac specific code (you're on linux those days, hopefully you still are)
6. some configuration options
7. the custom theme support via user css (in `.config/springald`)

## application structure

Electron has a main process, and a renderer process; this is nothing like server and client.

1. `src/renderer` is a pure frontend, no node; retro html script tags in index.html,
   all parts of the app are exposed via `window.app` (I've already said it's a mess)
2. `src/backend` is the electron main thread, node works, require works;
   - config parsing is here for convenience, but that could've been anywhere
   - window and tray handling must be here though; you access them through electron ipc sync messages
     (electron ipc is just a wrapper around a node EventEmitter)
3. `src/interim` is a place where you use node requires, but the script is
   included via a script tag in index.html; this messes up require a bit,
   but this is "normal" (like hell it is normal, but electron)

Don't forget, that a renderer process can do **nearly everything**. Multiple instance
and window management must be done in the main thread, but that's all. You launch
the apps for example from the renderer thread and that's okay. In this regard
both electron and nwjs are similar. A renderer is **not** a client.
