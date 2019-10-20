import 'package:flutter/material.dart';

class TitleBar extends StatelessWidget {
  final double height;

  const TitleBar({Key key, this.height}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        new Container(
          decoration: new BoxDecoration(
            gradient: new LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.lightBlue, const Color(0xFFE64C85)],
            ),
          ),
          height: height,
        ),
        new AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0.0,
          centerTitle: true,
          title: new Text(
            "Welcome Karan!",
            style: TextStyle(
                fontFamily: 'NothingYouCouldDo', fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }
}
