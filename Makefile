QMD_FILE = infosec.qmd
PORT = 4200

# Phony target to prevent file name conflict
.PHONY: all anim quarto publish serve preview clean

# Default target
all: anim quarto publish

# Target for building animations
anim:
	npm --prefix ./animations run build
	npm run build


serve:
	npm --prefix ./animations run serve

quarto:
	quarto render $(QMD_FILE)

preview:
	quarto preview $(QMD_FILE) --no-browser --port ${PORT}

publish:
	quarto render $(QMD_FILE)
	quarto publish $(QMD_FILE) --no-prompt

clean:
	rm -Recurse -Force -ErrorAction SilentlyContinue .\dist
