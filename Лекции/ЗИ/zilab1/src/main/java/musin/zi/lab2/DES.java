package musin.zi.lab2;

import lombok.SneakyThrows;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class DES {
    private final Cipher ecipher;
    private final Cipher dcipher;
    private final SecretKey key;

    @SneakyThrows
    public DES() {
        ecipher = Cipher.getInstance("DES");
        dcipher = Cipher.getInstance("DES");
        key = KeyGenerator.getInstance("DES").generateKey();

        ecipher.init(Cipher.ENCRYPT_MODE, key);
        dcipher.init(Cipher.DECRYPT_MODE, key);
    }

    @SneakyThrows
    public byte[] encrypt(byte[] s) {
        return ecipher.doFinal(s);
    }

    @SneakyThrows
    public byte[] decrypt(byte[] s) {
        return dcipher.doFinal(s);
    }
}