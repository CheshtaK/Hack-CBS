import 'package:flutter/material.dart';
import 'package:hack_cbs/screens/home/history/flight_stop_ticket.dart';
import 'package:hack_cbs/screens/home/history/ticket_card.dart';
import 'package:hack_cbs/utility/air_asia_bar.dart';

class TicketsPage extends StatefulWidget {
  @override
  _TicketsPageState createState() => _TicketsPageState();
}

class _TicketsPageState extends State<TicketsPage>
    with TickerProviderStateMixin {
  List<FlightStopTicket> stops = [
    new FlightStopTicket("", "Shilpa", "21 Oct", "12:00", ""),
    new FlightStopTicket("", "Neeraj", "22 Nov", "12:00", ""),
    new FlightStopTicket("", "Sandeep", "24 Dec", "12:00", ""),
    new FlightStopTicket("", "Sanjay", "3 Feb", "12:00", ""),
  ];
  AnimationController cardEntranceAnimationController;
  List<Animation> ticketAnimations;
  Animation fabAnimation;

  @override
  void initState() {
    super.initState();
    cardEntranceAnimationController = new AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1100),
    );
    ticketAnimations = stops.map((stop) {
      int index = stops.indexOf(stop);
      double start = index * 0.1;
      double duration = 0.6;
      double end = duration + start;
      return new Tween<double>(begin: 800.0, end: 0.0).animate(
          new CurvedAnimation(
              parent: cardEntranceAnimationController,
              curve: new Interval(start, end, curve: Curves.decelerate)));
    }).toList();
    fabAnimation = new CurvedAnimation(
        parent: cardEntranceAnimationController,
        curve: Interval(0.7, 1.0, curve: Curves.decelerate));
    cardEntranceAnimationController.forward();
  }

  @override
  void dispose() {
    cardEntranceAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: new Stack(
        children: <Widget>[
          TitleBar(
            height: 180.0,
          ),
          Positioned.fill(
            top: MediaQuery.of(context).padding.top + 64.0,
            child: SingleChildScrollView(
              child: new Column(
                children: _buildTickets().toList(),
              ),
            ),
          )
        ],
      ),
      floatingActionButton: _buildFab(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Iterable<Widget> _buildTickets() {
    return stops.map((stop) {
      int index = stops.indexOf(stop);
      return AnimatedBuilder(
        animation: cardEntranceAnimationController,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
          child: TicketCard(stop: stop),
        ),
        builder: (context, child) => new Transform.translate(
          offset: Offset(0.0, ticketAnimations[index].value),
          child: child,
        ),
      );
    });
  }

  _buildFab() {
    return ScaleTransition(
      scale: fabAnimation,
      child: FloatingActionButton(
        onPressed: () => Navigator.of(context).pop(),
        child: new Icon(Icons.add),
      ),
    );
  }
}
