package musin.zi.lab2;

import lombok.SneakyThrows;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import java.util.Base64;

import static java.nio.charset.StandardCharsets.UTF_8;

public class DES {
    private final Cipher ecipher;
    private final Cipher dcipher;

    @SneakyThrows
    public DES(String key) {
        final DESKeySpec spec = new DESKeySpec(key.getBytes(UTF_8));
        final SecretKeyFactory factory = SecretKeyFactory.getInstance("DES");
        final SecretKey secretKey = factory.generateSecret(spec);

        ecipher = Cipher.getInstance("DES");
        dcipher = Cipher.getInstance("DES");

        ecipher.init(Cipher.ENCRYPT_MODE, secretKey);
        dcipher.init(Cipher.DECRYPT_MODE, secretKey);
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