from pathlib import Path
from PIL import Image, ImageOps
root = Path(__file__).resolve().parents[1]
source = root / 'docs/screenshots/logopedia'
output = root / 'public/projects'
frames = []
for name in ['inicio', 'metodologia', 'blog']:
    image = Image.open(source / (name + '.jpg')).convert('RGB')
    image = image.crop((0, 0, image.width - 16, image.height - 16))
    frames.append(ImageOps.pad(image, (640, 360), method=Image.Resampling.LANCZOS, color='#101211'))
frames[0].save(output / 'logopedia-preview.webp', quality=85)
animated, durations = [], []
for index, frame in enumerate(frames):
    animated.append(frame)
    durations.append(2000)
    for alpha in [0.33, 0.67]:
        animated.append(Image.blend(frame, frames[(index + 1) % len(frames)], alpha))
        durations.append(140)
palette = Image.new('RGB', (640, 360 * 3))
for index, frame in enumerate(frames):
    palette.paste(frame, (0, index * 360))
palette = palette.quantize(colors=64, method=Image.Quantize.MEDIANCUT)
animated = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in animated]
animated[0].save(output / 'logopedia-preview.gif', save_all=True, append_images=animated[1:], duration=durations, loop=0, optimize=True, disposal=2)
with Image.open(output / 'logopedia-preview.gif') as result:
    print(f'{result.n_frames} frames, {result.size}, {(output / "logopedia-preview.gif").stat().st_size} bytes')

