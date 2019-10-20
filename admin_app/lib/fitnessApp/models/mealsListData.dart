class MealsListData {
  String imagePath;
  String titleTxt;
  String startColor;
  String endColor;
  List<String> meals;
  String severe;

  MealsListData({
    this.imagePath = '',
    this.titleTxt = '',
    this.startColor = "",
    this.endColor = "",
    this.meals,
    this.severe = "",
  });

  static List<MealsListData> tabIconsList = [
    MealsListData(
      imagePath: 'assets/fitness_app/sickKid.png',
      titleTxt: 'Common Cold',
      severe: "Low",
      meals: ["Disprin,", "Paracetamol,", "TusQ"],
      startColor: "#FA7D82",
      endColor: "#FFB295",
    ),
    MealsListData(
      imagePath: 'assets/fitness_app/eczema.png',
      titleTxt: 'Eczema',
      severe: "Level 2",
      meals: ["Ointment,", "Syrup,", "Avocado"],
      startColor: "#738AE6",
      endColor: "#5C5EDD",
    ),
    MealsListData(
      imagePath: 'assets/fitness_app/kneeee.png',
      titleTxt: 'Knee Injury',
      severe: "Minor",
      meals: ["XRay", "Red Medicine"],
      startColor: "#FE95B6",
      endColor: "#FF5287",
    ),
    MealsListData(
      imagePath: 'assets/fitness_app/constipation.png',
      titleTxt: 'Constipation',
      severe: "Normal",
      meals: ["Sudo", "Honitus Syrup"],
      startColor: "#6F72CA",
      endColor: "#1E1466",
    ),
  ];
}
