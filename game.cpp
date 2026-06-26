#include <bits/stdc++.h>
#include <windows.h>
#include <conio.h>
#define int long long
using namespace std;

// 生成指定长度的随机字符串
string randStr(int len) {
    string s = "";
    for (int i = 0; i < len; i++)
        s += char(rand() % 26 + 'A');
    return s;
}

// 带颜色的输出
void setColor(int color) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);
}

// 打印分隔线
void printLine() {
    setColor(11);
    cout << "========================================\n";
    setColor(7);
}

// 显示主菜单
void showMenu(int RMB, int day) {
    system("cls");
    setColor(14);
    cout << "  Work Take Fish Games\n";
    setColor(11);
    cout << "  scirco.(R)\n";
    setColor(7);
    printLine();
    setColor(10);
    cout << "  Day " << day << "  |  ";
    setColor(14);
    cout << "RMB: " << RMB << "\n";
    setColor(7);
    printLine();
    cout << "  1. Stock Market\n";
    cout << "  2. Lottery\n";
    cout << "  3. Work (Earn Money)\n";
    cout << "  4. Bank (Deposit/Withdraw)\n";
    cout << "  0. Exit\n";
    printLine();
    cout << "  Your choice: ";
}

// ===== 股市系统 =====
void stockMarket(int &RMB) {
    vector<string> names = {"TECH", "FOOD", "ENER", "MEDC", "GOLD"};
    vector<int> prices = {100, 50, 80, 120, 200};
    map<string, int> hold; // 持仓数量

    while (1) {
        system("cls");
        setColor(14);
        cout << "  === Stock Market ===\n";
        setColor(7);
        printLine();
        cout << "  Your RMB: " << RMB << "\n";
        printLine();
        cout << "  Code  Price   Change  Held\n";
        cout << "  ----  -----   ------  ----\n";
        for (int i = 0; i < 5; i++) {
            // 随机涨跌
            int change = (rand() % 21 - 10); // -10% ~ +10%
            int oldPrice = prices[i];
            prices[i] = max(1LL, prices[i] * (100 + change) / 100);
            int actualChange = prices[i] - oldPrice;
            cout << "  " << names[i] << "   ";
            setColor(14);
            cout << setw(5) << prices[i] << "   ";
            if (actualChange > 0) setColor(12); // 红=涨
            else if (actualChange < 0) setColor(10); // 绿=跌
            else setColor(7);
            cout << setw(5) << actualChange << "   ";
            setColor(7);
            cout << setw(4) << hold[names[i]] << "\n";
        }
        printLine();
        cout << "  1.Buy  2.Sell  0.Back\n";
        cout << "  Choice: ";
        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) break;
        if (op == 1) { // 买入
            cout << "  Stock code: ";
            string code; cin >> code;
            // 转大写
            for (auto &c : code) c = toupper(c);
            int idx = -1;
            for (int i = 0; i < 5; i++) if (names[i] == code) idx = i;
            if (idx == -1) { cout << "  Invalid code!\n"; Sleep(1000); continue; }
            cout << "  Amount: ";
            int amt; cin >> amt;
            if (amt <= 0) { cout << "  Invalid amount!\n"; Sleep(1000); continue; }
            int cost = prices[idx] * amt;
            if (cost > RMB) { cout << "  Not enough RMB! Need " << cost << "\n"; Sleep(1000); continue; }
            RMB -= cost;
            hold[code] += amt;
            cout << "  Bought " << amt << " " << code << " for " << cost << " RMB\n";
            Sleep(1000);
        } else if (op == 2) { // 卖出
            cout << "  Stock code: ";
            string code; cin >> code;
            for (auto &c : code) c = toupper(c);
            int idx = -1;
            for (int i = 0; i < 5; i++) if (names[i] == code) idx = i;
            if (idx == -1 || hold[code] == 0) { cout << "  No holdings!\n"; Sleep(1000); continue; }
            cout << "  Amount (0=all): ";
            int amt; cin >> amt;
            if (amt == 0) amt = hold[code];
            if (amt <= 0 || amt > hold[code]) { cout << "  Invalid amount!\n"; Sleep(1000); continue; }
            int revenue = prices[idx] * amt;
            RMB += revenue;
            hold[code] -= amt;
            cout << "  Sold " << amt << " " << code << " for " << revenue << " RMB\n";
            Sleep(1000);
        }
    }
}

// ===== 彩票系统 =====
void lottery(int &RMB) {
    int cost = 10; // 每次投注10元
    // 生成4位中奖号码
    string prize = randStr(4);

    while (1) {
        if (RMB < cost) {
            setColor(12);
            cout << "  Not enough RMB for lottery! Need " << cost << "\n";
            setColor(7);
            Sleep(1500);
            return;
        }

        system("cls");
        setColor(14);
        cout << "  === Lottery ===\n";
        setColor(7);
        printLine();
        cout << "  Your RMB: " << RMB << "\n";
        cout << "  Bet cost: " << cost << " RMB per draw\n";
        printLine();

        // 生成你的号码
        string your = randStr(4);
        RMB -= cost;

        // 计算匹配位数
        int match = 0;
        for (int i = 0; i < 4; i++)
            if (your[i] == prize[i]) match++;

        cout << "  Prize:  ";
        setColor(12);
        cout << prize << "\n";
        setColor(7);
        cout << "  Yours:  ";
        setColor(10);
        cout << your << "\n";
        setColor(7);

        // 奖金规则
        int reward = 0;
        if (match == 4) {
            reward = 5000;
            setColor(14);
            cout << "\n  *** JACKPOT! All 4 matched! ***\n";
        } else if (match == 3) {
            reward = 200;
            setColor(11);
            cout << "\n  ** 3 matched! Nice! **\n";
        } else if (match == 2) {
            reward = 20;
            setColor(10);
            cout << "\n  * 2 matched! Small prize! *\n";
        } else {
            setColor(7);
            cout << "\n  " << match << " matched. Better luck next time.\n";
        }
        setColor(7);

        if (reward > 0) {
            RMB += reward;
            cout << "  You won " << reward << " RMB!\n";
        }
        cout << "  Current RMB: " << RMB << "\n";
        printLine();
        cout << "  1.Play Again  0.Back\n";
        cout << "  Choice: ";
        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op != 1) break;
    }
}

// ===== 工作系统 =====
void work(int &RMB, int &day) {
    system("cls");
    setColor(14);
    cout << "  === Job Board ===\n";
    setColor(7);
    printLine();

    vector<string> jobs = {"Delivery", "Cashier", "Tutor", "Programmer", "Manager"};
    vector<int> pays = {50, 80, 120, 200, 350};
    vector<int> energy = {1, 1, 2, 2, 3};

    for (int i = 0; i < 5; i++) {
        cout << "  " << i + 1 << ". " << jobs[i]
             << "  Pay: " << pays[i] << " RMB"
             << "  Energy: " << energy[i] << "\n";
    }
    cout << "  0. Back\n";
    printLine();
    cout << "  Your RMB: " << RMB << "\n";
    cout << "  Choice: ";

    int op;
    if (!(cin >> op)) { cin.clear(); cin.ignore(); return; }
    if (op >= 1 && op <= 5) {
        int idx = op - 1;
        RMB += pays[idx];
        cout << "  You worked as " << jobs[idx] << " and earned " << pays[idx] << " RMB!\n";
        day++;
        cout << "  Day progressed to " << day << "\n";
        Sleep(1500);
    }
}

// ===== 银行系统 =====
void bank(int &RMB) {
    static int deposit = 0;
    static double rate = 0.05; // 5% 利率

    while (1) {
        system("cls");
        setColor(14);
        cout << "  === Bank ===\n";
        setColor(7);
        printLine();
        cout << "  Cash:     " << RMB << " RMB\n";
        cout << "  Deposit:  " << deposit << " RMB\n";
        cout << "  Interest: " << (int)(deposit * rate) << " RMB (5%)\n";
        printLine();
        cout << "  1.Deposit  2.Withdraw  3.Collect Interest  0.Back\n";
        cout << "  Choice: ";

        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) break;
        if (op == 1) {
            cout << "  Amount: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > RMB) { cout << "  Invalid!\n"; Sleep(1000); continue; }
            RMB -= amt;
            deposit += amt;
            cout << "  Deposited " << amt << " RMB\n";
            Sleep(1000);
        } else if (op == 2) {
            cout << "  Amount: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > deposit) { cout << "  Invalid!\n"; Sleep(1000); continue; }
            deposit -= amt;
            RMB += amt;
            cout << "  Withdrew " << amt << " RMB\n";
            Sleep(1000);
        } else if (op == 3) {
            int interest = deposit * rate;
            if (interest <= 0) { cout << "  No interest to collect!\n"; Sleep(1000); continue; }
            RMB += interest;
            deposit += interest; // 复利
            cout << "  Collected " << interest << " RMB interest!\n";
            Sleep(1000);
        }
    }
}

signed main() {
    srand((unsigned int)time(NULL));
    int RMB = 1000;
    int day = 1;

    system("title Work Take Fish Games");

    // 开场
    system("cls");
    setColor(14);
    cout << "\n  Work Take Fish Games\n";
    setColor(11);
    cout << "  scirco.(R)\n\n";
    setColor(7);
    cout << "  Starting with 1000 RMB...\n";
    Sleep(2000);

    while (1) {
        if (RMB < 0) {
            system("cls");
            setColor(12);
            cout << "\n  *** YOU ARE BANKRUPT! ***\n\n";
            setColor(7);
            cout << "  You survived " << day << " days.\n";
            Sleep(3000);
            return 0;
        }

        showMenu(RMB, day);

        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }

        switch (op) {
            case 1: stockMarket(RMB); break;
            case 2: lottery(RMB); break;
            case 3: work(RMB, day); break;
            case 4: bank(RMB); break;
            case 0:
                cout << "  Bye!\n";
                return 0;
            default: break;
        }
    }
    return 0;
}
