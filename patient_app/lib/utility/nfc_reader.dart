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
    });
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
      body: Column(
        children: <Widget>[
          TextField(
            controller: writerController,
          ),
          RaisedButton(
            onPressed: () {
              FlutterNfcReader.read();
            },
            child: Text("Read"),
          ),
          RaisedButton(
            onPressed: () {
              FlutterNfcReader.write(" ", writerController.text).then((value) {
                print(value.content);
              });
            },
            child: Text("Write"),
          )
        ],
      ),
    );
  }
}