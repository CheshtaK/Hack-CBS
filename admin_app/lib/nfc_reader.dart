import 'package:best_flutter_ui_templates/fitnessApp/fitnessAppHomeScreen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_nfc_reader/flutter_nfc_reader.dart';

class NfcScan extends StatefulWidget {
  NfcScan({Key key}) : super(key: key);

  @override
  _NfcScanState createState() => _NfcScanState();
}

class _NfcScanState extends State<NfcScan> {
  TextEditingController writerController = TextEditingController();

  @override
  initState() {
    super.initState();
    writerController.text = 'Flutter NFC Scan';
    FlutterNfcReader.onTagDiscovered().listen((onData) {
      print(onData.id);
      print(onData.content);
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => FitnessAppHomeScreen()));
    });
    //FlutterNfcReader.read();
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is removed from the
    // widget tree.
    writerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          // padding: EdgeInsets.all(50.0),
          alignment: Alignment.center,
          height: 1000.0,
          decoration: new BoxDecoration(
            gradient: new LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.lightBlue, const Color(0xFFE64C85)],
            ),
          ),
          child: Center(
            child: Text(
              "Tap Card for Authentication!",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 40.0,
                color: Colors.white,
                fontFamily: 'NothingYouCouldDo',
                fontWeight: FontWeight.bold,
              ),
            ),
          )),
    );
  }
}
