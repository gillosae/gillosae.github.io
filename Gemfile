# frozen_string_literal: true

source "https://rubygems.org"

gem "kramdown-parser-gfm"
gem "jekyll", "~> 4.2"
gem "jekyll-remote-theme"
# these came in via the theme gemspec before; _config.yml loads them as plugins
gem "jekyll-feed"
gem "jekyll-seo-tag"

# NOTE: no `gemspec` here on purpose. This is a site repo, not the theme gem
# repo, and no-style-please.gemspec pins jekyll ~> 3.9, which conflicts with
# the jekyll ~> 4.2 above and makes `bundle install` unresolvable. The theme
# itself is pulled in at build time via remote_theme in _config.yml.