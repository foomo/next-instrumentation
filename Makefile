-include .makerc
.DEFAULT_GOAL:=help

# --- Config ------------------------------------------------------------------

# Newline hack for error output
define br


endef

# --- Targets -----------------------------------------------------------------

# This allows us to accept extra arguments
%: .mise .lefthook
	@:

.PHONY: .mise
# Install dependencies
.mise: msg := $(br)$(br)Please ensure you have 'mise' installed and activated!$(br)$(br)$$ brew update$(br)$$ brew install mise$(br)$(br)See the documentation: https://mise.jdx.dev/getting-started.html$(br)$(br)
.mise:
ifeq (, $(shell command -v mise))
	$(error ${msg})
endif
	@mise install

.PHONY: .lefthook
# Configure git hooks for lefthook
.lefthook:
	@lefthook install

### Tasks

.PHONY: check
## Run all checks
check: lint type-check test
	@biome check .

.PHONY: lint
## Run biome lint
lint:
	@biome check .

.PHONY: lint.fix
## Run biome lint fix
lint.fix:
	@biome check --write .

.PHONY: lint.fix.unsafe
## Run biome lint fix unsafe
lint.fix.unsafe:
	@biome check --write --unsafe .

.PHONY: type-check
## Run tsc type-check
type-check:
	@tsc --noEmit

.PHONY: test
## Run tests
test:
	@bun test --coverage

.PHONY: test.watch
## Run tests & watch
test.watch:
	@bun test --watch

.PHONY: build
## Build sources
build:
	@bunup

### Publish

.PHONY: bump
## Bump version interactively
bump: check
	@bumpp --no-push

.PHONY: bump.push
## Bump version interactively & push
bump.push: check
	@bumpp

.PHONY: publish
# Publish release
publish: check
	@bun publish

### Utils

.PHONY: help
## Show help text
help:
	@echo ""
	@echo "Next Proxy Middleware\n"
	@echo "Usage:\n  make [task]"
	@awk '{ \
		if($$0 ~ /^### /){ \
			if(help) printf "%-23s %s\n\n", cmd, help; help=""; \
			printf "\n%s:\n", substr($$0,5); \
		} else if($$0 ~ /^[a-zA-Z0-9._-]+:/){ \
			cmd = substr($$0, 1, index($$0, ":")-1); \
			if(help) printf "  %-23s %s\n", cmd, help; help=""; \
		} else if($$0 ~ /^##/){ \
			help = help ? help "\n                        " substr($$0,3) : substr($$0,3); \
		} else if(help){ \
			print "\n                        " help "\n"; help=""; \
		} \
	}' $(MAKEFILE_LIST)
