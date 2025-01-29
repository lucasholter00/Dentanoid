package com.group20.dentanoid.Utils;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.stream.Stream;

public class Utils {
  // Physical measures of the Earth in KM
  public static double earthRadius = 6371;
  public static double earthCircumference = 40075;

    /*
      * Haversine Formula, Credits to https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    
      * Returns the distance in kilometers between two global coordinates,
        accounting for the spherical shape of the Earth by using its radius
    */
    public static double haversineFormula(double[] positionA, double[] positionB) {
        double dLat = deg2rad(positionB[0] - positionA[0]);
        double dLon = deg2rad(positionB[1] - positionA[1]);

        double a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(positionA[0])) * Math.cos(deg2rad(positionB[0])) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        double d = earthRadius * c; // Distance in km
        return d;
      }
      
    private static double deg2rad(double deg) {
        return deg * (Math.PI/180);
    }

    public static double[] convertStringToDoubleArray(String[] input) {
        return Arrays.stream(input)
                .mapToDouble(Double::parseDouble)
                .toArray();
    }

    public static String[] concatTwoArrays(String[] arrA, String[] arrB) {
      return Stream.concat(Arrays.stream(arrA), Arrays.stream(arrB))
                      .toArray(String[]::new);
    }

  public static void writeToFile(String path, String content) {
    try {
      FileWriter file = new FileWriter(path);
      file.write(content);
      file.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static String readFile(String path) throws IOException {
    return new String(Files.readAllBytes(Paths.get(path)));
  }

  public static String quoteString(String s) {
    return "\"" + s + "\"";
  }
}
