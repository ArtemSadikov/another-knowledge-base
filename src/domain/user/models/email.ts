export class UserEmail {
  constructor(public readonly value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCorrect = emailRegex.test(value);

    if (!isCorrect) {
      throw new Error("Invalid email address");
    }
  }
}
