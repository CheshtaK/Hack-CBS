import 'package:flutter/material.dart';
import 'package:hack_cbs/screens/home/content_card.dart';
import 'package:hack_cbs/utility/air_asia_bar.dart';
import 'package:hack_cbs/utility/rounded_button.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          TitleBar(height: 210.0),
          Positioned.fill(
            child: Padding(
              padding: EdgeInsets.only(
                  top: MediaQuery.of(context).padding.top + 40.0),
              child: new Column(
                children: <Widget>[
                  _buildButtonsRow(),
                  Expanded(child: ContentCard()),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButtonsRow() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        children: <Widget>[
          new RoundedButton(
            text: "HISTORY",
          ),
          new RoundedButton(text: "APPOINTMENTS"),
          new RoundedButton(text: "PROFILE", selected: true),
        ],
      ),
    );
  }
}
