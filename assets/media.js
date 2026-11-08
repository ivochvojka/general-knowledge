for (const image of document.querySelectorAll('figure img')) {
  const showFallback = () => {
    image.hidden = true;
    image.closest('figure').querySelector('.image-fallback').hidden = false;
  };
  image.addEventListener('error', showFallback, { once: true });
  if (image.complete && !image.naturalWidth) showFallback();
}
