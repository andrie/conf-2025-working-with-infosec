QMD_FILE = infosec.qmd
PORT = 4200

# Phony target to prevent file name conflict
.PHONY: all anim quarto publish serve preview clean

# Default target
all: anim quarto publish


install:
	cd animations && rm -rf node_modules package-lock.json
	mnpm install

# Target for building animations

scene:
	./node_modules/.bin/vite build


anim:
# 	npm run build
	npm --prefix ./animations run build


serve:
	npm --prefix ./animations run serve

quarto:
	npm run build
	npm --prefix ./animations run build
	quarto render $(QMD_FILE)

preview:
	npm run build
	npm --prefix ./animations run build
	quarto preview $(QMD_FILE) --no-browser --port ${PORT}

publish:
	npm run build
	npm --prefix ./animations run build
	quarto render $(QMD_FILE)
	quarto publish $(QMD_FILE) --no-prompt

clean:
	powershell -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\dist"

