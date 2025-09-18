import {IPasswordHasher} from "../../domain/user/type";
import bcrypt from 'bcrypt';

export class BcryptPasswordHasherService implements IPasswordHasher {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public async verify(password: string, hash: string): Promise<void> {
    const isVerified = await bcrypt.compare(password, hash);

    if (!isVerified) {
      throw new Error("Password doesn't match");
    }
  }
}
