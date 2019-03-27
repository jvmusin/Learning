package musin.zi.lab2;

import lombok.SneakyThrows;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;

import static java.nio.charset.StandardCharsets.UTF_8;

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
    public String encrypt(String s) {
        byte[] raw = s.getBytes(UTF_8);
        byte[] encrypted = ecipher.doFinal(raw);
        byte[] b64 = Base64.getEncoder().encode(encrypted);
        return new String(b64, UTF_8);
    }

    @SneakyThrows
    public String decrypt(String s) {
        byte[] b64 = s.getBytes(UTF_8);
        byte[] encrypted = Base64.getDecoder().decode(b64);
        byte[] decrypted = dcipher.doFinal(encrypted);
        return new String(decrypted, UTF_8);
    }
}