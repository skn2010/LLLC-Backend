export default function generateUniqueName(): string {
  const timestamp: number = Date.now();
  const randomString: string = Math.random().toString(36).substring(2, 8); // Use a random string
  const uniqueName: string = `${timestamp}-${randomString}`;
  return uniqueName;
}
