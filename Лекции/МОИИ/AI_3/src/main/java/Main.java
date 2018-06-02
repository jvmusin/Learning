package main.java;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Random;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws IOException {
        int letterCount = 7;
        int letterSize = 8 * 8;
        double[][] weights = generateRandomTable(letterCount, letterSize + 1);
        int[][] inputs = readSelections(letterCount, letterSize, new Scanner(Paths.get("teaching.txt")));
        for (int i = 0; i < letterCount; i++) {
            boolean anyUpdate = true;
            while (anyUpdate) {
                anyUpdate = false;
                for (int j = 0; j < letterCount; j++)
                    anyUpdate |= updateWeights(inputs[j], weights[i], i == j ? 1 : 0, 0.2);
            }
        }
        int[] letter = readSelection(letterSize, new Scanner(Paths.get("input.txt")));
        char[] letters = {'А', 'Л', 'Ь', 'М', 'К', 'Е', 'В'};
        for (int i = 0; i < letterCount; i++) {
            double sum = 0;
            for (int j = 0; j < letterSize + 1; j++)
                sum += letter[j] * weights[i][j];
            if (sum >= 0)
                System.out.println("Это буква " + letters[i]);
        }
    }

    private static int[][] readSelections(int selectionCount, int selectionSize, Scanner input) {
        int[][] selections = new int[selectionCount][];
        for (int i = 0; i < selectionCount; i++) selections[i] = readSelection(selectionSize, input);
        return selections;
    }

    private static int[] readSelection(int size, Scanner input) {
        int[] selection = new int[size + 1];
        selection[0] = 1;
        for (int j = 1; j < size + 1; j++)
            selection[j] = input.nextInt();
        return selection;
    }

    private static double[][] generateRandomTable(int rowCount, int columnCount) {
        Random r = new Random();
        double[][] a = new double[rowCount][columnCount];
        for (int i = 0; i < rowCount; i++)
            for (int j = 0; j < columnCount; j++)
                a[i][j] = r.nextDouble() * 10 - 5;
        return a;
    }

    private static boolean updateWeights(int[] inputs, double[] weights, int target, double speed) {
        double sum = 0;
        for (int i = 0; i < inputs.length; i++)
            sum += inputs[i] * weights[i];

        int y = sum >= 0 ? 1 : 0;
        if (y == target) return false;

        int delta = target - y;
        for (int i = 0; i < weights.length; i++)
            weights[i] += speed * inputs[i] * delta;
        return true;
    }
}