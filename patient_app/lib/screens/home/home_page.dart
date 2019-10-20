import 'package:flutter/material.dart';
import 'package:hack_cbs/input_page/input_page.dart';
import 'package:hack_cbs/screens/home/content_card.dart';
import 'package:hack_cbs/screens/home/history/fade_route.dart';
import 'package:hack_cbs/screens/home/history/tickets_page.dart';
import 'package:hack_cbs/utility/air_asia_bar.dart';
import 'package:hack_cbs/utility/rounded_button.dart';

class HomePage extends StatelessWidget {
  final bool showToast;
  HomePage(this.showToast);

  final snackBar = SnackBar(content: Text('Saved!'));

  @override
  Widget build(BuildContext context) {

    var _scaffoldKey = new GlobalKey<ScaffoldState>();

    return Scaffold(
      key: _scaffoldKey,
      body: Stack(
        children: <Widget>[
          TitleBar(height: 210.0),
          Positioned.fill(
            child: Padding(
              padding: EdgeInsets.only(
                  top: MediaQuery.of(context).padding.top + 40.0),
              child: new Column(
                children: <Widget>[
                  _buildButtonsRow(context),
                  Expanded(child: ContentCard()),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButtonsRow(BuildContext context) {

     return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        children: <Widget>[
          new RoundedButton(
            text: "HISTORY",
            selected: true,
          ),
          new RoundedButton(
            text: "APPOINTMENTS",
            onTap: () => Navigator.of(context)
                .push(FadeRoute(builder: (context) => TicketsPage())),
          ),
          new RoundedButton(
            text: "PROFILE",
            onTap: () => Navigator.of(context)
                .push(MaterialPageRoute(builder: (context) => InputPage())),
          ),
        ],
      ),
    );
  }
}
