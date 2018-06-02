package main.java;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Random;
import java.util.Scanner;

public class Main {

    private static final char[] ALPHABET = "НАСТЯ".toCharArray();
    private static final boolean[] IS_VOWEL = {false, true, false, false, true};
    private static final int LETTER_COUNT = ALPHABET.length;
    private static final int LETTER_SIZE = 8 * 8;
    private static final int GENERATION_SIZE = 100;
    private static final Letter[] LETTERS = new Letter[LETTER_COUNT];
    private static final Random rnd = new Random();

    public static void main(String[] args) throws IOException {
        Scanner lettersScanner = new Scanner(Paths.get("teaching.txt"));
//        Generation[] generations = new Generation[LETTER_COUNT];
        for (int i = 0; i < LETTER_COUNT; i++) {
            Letter letter = Letter.read(ALPHABET[i], IS_VOWEL[i], lettersScanner);
            LETTERS[i] = letter;
//            generations[i] = Generation.generate(letter);
        }

        Letter vowel = new Letter('+', true, null);
        Letter notVowel = new Letter('-', false, null);
        Generation[] checkers = {Generation.generate(vowel), Generation.generate(notVowel)};
        for (int i = 0; i < checkers.length; i++) {
            Generation.era = 0;
            checkers[i] = checkers[i].evaluate();
            System.err.println(Generation.era);
        }

        Letter letterToTest = Letter.read('?', false, new Scanner(Paths.get("input.txt")));
//        for (Letter letter : LETTERS)
//            if (letterToTest.checkWeights(letter.weights))
//                System.out.println("Эта буква " + letter.name);
        for (Generation checker : checkers) {
            if (letterToTest.checkWeights(checker.letter.weights)) {
                System.out.println("Эта буква " + (checker.letter.isVowel ? "гласная" : "согласная"));
            }
        }
    }

    static class Letter {
        final char name;
        final boolean isVowel;
        final int[] representation;
        double[] weights;

        Letter(char name, boolean isVowel, int[] representation) {
            this.name = name;
            this.isVowel = isVowel;
            this.representation = representation;
        }

        static Letter read(char name, boolean isVowel, Scanner in) {
            int[] representation = new int[LETTER_SIZE];
            for (int i = 0; i < LETTER_SIZE; i++) representation[i] = in.nextInt();
            return new Letter(name, isVowel, representation);
        }

        boolean checkWeights(double[] weights) {
            double sum = 0;
            for (int i = 0; i < LETTER_SIZE; i++) sum += representation[i] * weights[i];
            return sum >= 0;
        }
    }

    static class Generation {
        final Letter letter;
        final double[][] variants;

        Generation(Letter letter, double[][] variants) {
            this.letter = letter;
            this.variants = variants;
        }

        static Generation generate(Letter letter) {
            double[][] table = new double[GENERATION_SIZE][LETTER_SIZE];
            for (int i = 0; i < GENERATION_SIZE; i++)
                for (int j = 0; j < LETTER_SIZE; j++)
                    table[i][j] = randomWeight();
            return new Generation(letter, table);
        }

        static int era = 0;
        static Generation evaluate(Generation generation) {
            while (true) {
                era++;
                for (double[] weights : generation.variants) {
                    boolean ok = true;
                    for (Letter cur : LETTERS) {
//                        if (cur.checkWeights(weights) != generation.letter.isVowel) {
//                            ok = false;
//                            break;
//                        }
                        if (generation.letter.isVowel) {
                            if (cur.checkWeights(weights) != cur.isVowel) {
                                ok = false;
                                break;
                            }
                        } else {
                            if (cur.checkWeights(weights) != !cur.isVowel) {
                                ok = false;
                                break;
                            }
                        }
                    }
                    if (ok) {
                        generation.letter.weights = weights;
                        return generation;
                    }
                }
                generation = generation.next();
            }
        }

        static double randomWeight() {
            return rnd.nextDouble() * 10 - 5;
        }

        void sort() {
            Arrays.sort(variants, Comparator.comparingInt(weights -> {
                int countBad = 0;
                for (Letter cur : LETTERS) {
//                    if (cur.isVowel != cur.checkWeights(weights))
//                        countBad++;
                    if (letter.isVowel) {
                        if (cur.checkWeights(weights) != cur.isVowel) {
                            countBad++;
                        }
                    } else {
                        if (cur.checkWeights(weights) != !cur.isVowel) {
                            countBad++;
                        }
                    }
                }
                return countBad;
            }));
        }

        void mutate(int at) {
            variants[at][rnd.nextInt(LETTER_SIZE)] = randomWeight();
        }

        Generation next() {
            Generation intermediateGeneration = new Generation(letter, new double[GENERATION_SIZE * 2][]);
            /* Скрещивание*/
            for (int i = 0; i < GENERATION_SIZE; i++)
                intermediateGeneration.variants[i] = crossWeights(
                        variants[rnd.nextInt(GENERATION_SIZE)],
                        variants[rnd.nextInt(GENERATION_SIZE)]);
            for (int i = 0; i < GENERATION_SIZE; i++)
                intermediateGeneration.variants[GENERATION_SIZE + i] = variants[i].clone();
            /* Мутации */
            for (int i = 0; i < GENERATION_SIZE / 4; i++)
                intermediateGeneration.mutate(rnd.nextInt(GENERATION_SIZE));
            intermediateGeneration.sort();
            return new Generation(letter, Arrays.copyOfRange(intermediateGeneration.variants, 0, GENERATION_SIZE));
        }

        double[] crossWeights(double[] weights1, double[] weights2) {
            int length = weights1.length;
            double[] result = new double[length];
            int position = rnd.nextInt(length + 1);
            System.arraycopy(weights1, 0, result, 0, position);
            System.arraycopy(weights2, position, result, position, length - position);
            return result;
        }

        Generation evaluate() {
            return evaluate(this);
        }
    }
}