import 'package:flutter_test/flutter_test.dart';
import 'package:okn_saferide/main.dart';

void main() {
  testWidgets('App starts without crashing', (WidgetTester tester) async {
    await tester.pumpWidget(const OKNSafeRideApp());
    expect(find.text('OKN SafeRide'), findsOneWidget);
  });
}