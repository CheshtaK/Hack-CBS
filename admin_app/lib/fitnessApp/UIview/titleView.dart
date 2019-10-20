import 'package:best_flutter_ui_templates/fitnessApp/fintnessAppTheme.dart';
import 'package:flutter/material.dart';

class TitleView extends StatelessWidget {
  final String titleTxt;
  final String subTxt;
  final AnimationController animationController;
  final Animation animation;
  final bool giveTopPad;

  const TitleView(
      {Key key,
      this.titleTxt: "",
      this.subTxt: "",
      this.animationController,
      this.giveTopPad: false,
      this.animation})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animationController,
      builder: (BuildContext context, Widget child) {
        return FadeTransition(
          opacity: animation,
          child: new Transform(
            transform: new Matrix4.translationValues(
                0.0, 30 * (1.0 - animation.value), 0.0),
            child: Container(
              child: Padding(
                padding: giveTopPad == false
                    ? const EdgeInsets.only(
                        left: 24,
                        right: 24,
                      )
                    : const EdgeInsets.only(left: 24, right: 24, top: 20.0),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        titleTxt,
                        textAlign: TextAlign.left,
                        style: TextStyle(
                          fontFamily: FintnessAppTheme.fontName,
                          fontWeight: FontWeight.w500,
                          fontSize: 18,
                          letterSpacing: 0.5,
                          color: FintnessAppTheme.lightText,
                        ),
                      ),
                    ),
                    InkWell(
                      highlightColor: Colors.transparent,
                      borderRadius: BorderRadius.all(Radius.circular(4.0)),
                      onTap: () {},
                      child: Padding(
                        padding: const EdgeInsets.only(left: 8),
                        child: Row(
                          children: <Widget>[
                            Text(
                              subTxt,
                              textAlign: TextAlign.left,
                              style: TextStyle(
                                fontFamily: FintnessAppTheme.fontName,
                                fontWeight: FontWeight.normal,
                                fontSize: 16,
                                letterSpacing: 0.5,
                                color: FintnessAppTheme.nearlyDarkBlue,
                              ),
                            ),
                            subTxt.length != 0
                                ? SizedBox(
                                    height: 38,
                                    width: 26,
                                    child: Icon(
                                      Icons.arrow_forward,
                                      color: FintnessAppTheme.darkText,
                                      size: 18,
                                    ),
                                  )
                                : Container(),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
