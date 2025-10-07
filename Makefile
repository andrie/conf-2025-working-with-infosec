QMD_FILE = infosec.qmd
PORT = 4200

# Phony target to prevent file name conflict
.PHONY: all build anim quarto publish serve preview clean scene

# Default target
all: anim quarto publish


install:
	cd animations && rm -rf node_modules package-lock.json
	mnpm install

# Target for building animations

scene:
	./node_modules/.bin/vite build


build:
	npm run build
	npm --prefix ./animations run build

anim: build


serve:
	npm --prefix ./animations run serve

quarto: anim
	quarto render $(QMD_FILE)

preview: anim
	quarto preview $(QMD_FILE) --no-browser --port ${PORT}

publish: anim
	quarto render $(QMD_FILE)
	quarto publish $(QMD_FILE) --no-prompt

clean:
	powershell -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\dist"

