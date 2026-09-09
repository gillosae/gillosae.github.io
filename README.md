# gillosae.github.io

Personal site of Hayoon Kim. Jekyll (GitHub Pages), theme pulled in at build
time via `remote_theme: riggraz/no-style-please`.

## Layout

```
_config.yml            site config
_data/menu.yml         the homepage — info, research interest, publications
_layouts/ _includes/ _sass/
                       local overrides of the remote theme
assets/                site assets
  css/main.scss        entry point that imports the theme stylesheet
  images/emosical/     figures for the emosical page
  pdfs/                papers
  logo.png             favicon
index.md               homepage (renders _data/menu.yml)
aib.md emosical.md     publication pages, served at /<slug>.html

countdown/             standalone deadline countdown, served at /countdown/
flying/                flight log app, served at /flying/
  data/ logos/sq/
taberu/                kana drill, served at /taberu/
senujin/               wedding invitation, served at /senujin/
yoonyoung/             wedding invitation, served at /yoonyoung/

_apps/                 sources for the built apps above; the leading underscore
  senujin/             keeps Jekyll from publishing them
  yoonyoung/
```

`senujin/` and `yoonyoung/` hold **build output only** — the deployed
`index.html` and the hashed `assets/`. Their React/vite sources live in
`_apps/`.

## Rebuilding an app

```sh
cd _apps/senujin
npm install
npm run build
rsync -a --delete dist/ ../../senujin/
```

`vite.config.ts` sets `base: '/senujin/'`, so the built bundle already points at
the deployed path. Use `rsync -a` (or `cp -a`) rather than a shell glob — asset
filenames contain spaces, and an unquoted copy has silently dropped files before.

## Running the site locally

```sh
bundle install
bundle exec jekyll serve
```

## License

Theme by Riccardo Graziosi, MIT — see `LICENSE.txt`.
