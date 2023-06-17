import 'package:flutter/material.dart';
import 'package:xoxo_battles/screens/create_room_screen.dart';
import 'package:xoxo_battles/screens/join_room_screen.dart';
import 'package:xoxo_battles/utils/colors.dart';
import 'package:xoxo_battles/screens/main_menu_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: bgColor,
      ),
      routes: {
        MainMenuScreen.routeName: (context) => const MainMenuScreen(),
        JoinRoomScreen.routeName: (context) => const JoinRoomScreen(),
        CreateRoomScreen.routeName: (context) => const CreateRoomScreen()
      },
      initialRoute: MainMenuScreen.routeName,
    );
  }
}
