// Static-export image loader: prefix the GitHub Pages base path.
export default function loader({ src }: { src: string }) {
  return `/leorus-games${src}`;
}
