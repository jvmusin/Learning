package lab2;

public class TripleDES {
    private final DES des1;
    private final DES des2;
    private final DES des3;

    public TripleDES(String key1, String key2, String key3) {
        des1 = new DES(key1);
        des2 = new DES(key2);
        des3 = new DES(key3);
    }

    public String encrypt(String s) {
        return des3.encrypt(des2.encrypt(des1.encrypt(s)));
    }

    public String decrypt(String s) {
        return des1.decrypt(des2.decrypt(des3.decrypt(s)));
    }
}