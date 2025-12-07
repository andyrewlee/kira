export async function playMp3Blob(blob: Blob): Promise<HTMLAudioElement> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play();
  audio.onended = () => URL.revokeObjectURL(url);
  return audio;
}
