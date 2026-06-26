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
    cout << "  搬鱼游戏\n";
    setColor(11);
    cout << "  scirco.(R)\n";
    setColor(7);
    printLine();
    setColor(10);
    cout << "  第 " << day << " 天  |  ";
    setColor(14);
    cout << "RMB: " << RMB << "\n";
    setColor(7);
    printLine();
    cout << "  1. 股市\n";
    cout << "  2. 彩票\n";
    cout << "  3. 打工赚钱\n";
    cout << "  4. 银行存取\n";
    cout << "  0. 退出\n";
    printLine();
    cout << "  请选择: ";
}

// ===== 股市系统 =====
void stockMarket(int &RMB) {
    vector<string> names = {"TECH", "FOOD", "ENER", "MEDC", "GOLD"};
    vector<string> labels = {"科技", "食品", "能源", "医药", "黄金"};
    vector<int> prices = {100, 50, 80, 120, 200};
    map<string, int> hold; // 持仓数量

    while (1) {
        system("cls");
        setColor(14);
        cout << "  === 股市 ===\n";
        setColor(7);
        printLine();
        cout << "  你的RMB: " << RMB << "\n";
        printLine();
        cout << "  代码  名称  价格    涨跌  持有\n";
        cout << "  ----  ----  -----   ----  ----\n";
        for (int i = 0; i < 5; i++) {
            // 随机涨跌
            int change = (rand() % 21 - 10); // -10% ~ +10%
            int oldPrice = prices[i];
            prices[i] = max(1LL, prices[i] * (100 + change) / 100);
            int actualChange = prices[i] - oldPrice;
            cout << "  " << names[i] << "  " << labels[i] << "  ";
            setColor(14);
            cout << setw(5) << prices[i] << "   ";
            if (actualChange > 0) setColor(12); // 红=涨
            else if (actualChange < 0) setColor(10); // 绿=跌
            else setColor(7);
            cout << setw(5) << actualChange << "  ";
            setColor(7);
            cout << setw(4) << hold[names[i]] << "\n";
        }
        printLine();
        cout << "  1.买入  2.卖出  0.返回\n";
        cout << "  请选择: ";
        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) break;
        if (op == 1) { // 买入
            cout << "  输入股票代码: ";
            string code; cin >> code;
            // 转大写
            for (auto &c : code) c = toupper(c);
            int idx = -1;
            for (int i = 0; i < 5; i++) if (names[i] == code) idx = i;
            if (idx == -1) { cout << "  无效代码!\n"; Sleep(1000); continue; }
            cout << "  买入数量: ";
            int amt; cin >> amt;
            if (amt <= 0) { cout << "  无效数量!\n"; Sleep(1000); continue; }
            int cost = prices[idx] * amt;
            if (cost > RMB) { cout << "  余额不足! 需要 " << cost << " 元\n"; Sleep(1000); continue; }
            RMB -= cost;
            hold[code] += amt;
            cout << "  买入 " << amt << " 股 " << code << "，花费 " << cost << " 元\n";
            Sleep(1000);
        } else if (op == 2) { // 卖出
            cout << "  输入股票代码: ";
            string code; cin >> code;
            for (auto &c : code) c = toupper(c);
            int idx = -1;
            for (int i = 0; i < 5; i++) if (names[i] == code) idx = i;
            if (idx == -1 || hold[code] == 0) { cout << "  无持仓!\n"; Sleep(1000); continue; }
            cout << "  卖出数量(0=全部): ";
            int amt; cin >> amt;
            if (amt == 0) amt = hold[code];
            if (amt <= 0 || amt > hold[code]) { cout << "  无效数量!\n"; Sleep(1000); continue; }
            int revenue = prices[idx] * amt;
            RMB += revenue;
            hold[code] -= amt;
            cout << "  卖出 " << amt << " 股 " << code << "，获得 " << revenue << " 元\n";
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
            cout << "  余额不足，无法购买彩票! 需要 " << cost << " 元\n";
            setColor(7);
            Sleep(1500);
            return;
        }

        system("cls");
        setColor(14);
        cout << "  === 彩票 ===\n";
        setColor(7);
        printLine();
        cout << "  你的RMB: " << RMB << "\n";
        cout << "  投注费: " << cost << " 元/次\n";
        printLine();

        // 生成你的号码
        string your = randStr(4);
        RMB -= cost;

        // 计算匹配位数
        int match = 0;
        for (int i = 0; i < 4; i++)
            if (your[i] == prize[i]) match++;

        cout << "  中奖号码: ";
        setColor(12);
        cout << prize << "\n";
        setColor(7);
        cout << "  你的号码: ";
        setColor(10);
        cout << your << "\n";
        setColor(7);

        // 奖金规则
        int reward = 0;
        if (match == 4) {
            reward = 5000;
            setColor(14);
            cout << "\n  *** 大奖! 4位全中! ***\n";
        } else if (match == 3) {
            reward = 200;
            setColor(11);
            cout << "\n  ** 中了3位! 不错! **\n";
        } else if (match == 2) {
            reward = 20;
            setColor(10);
            cout << "\n  * 中了2位! 小奖! *\n";
        } else {
            setColor(7);
            cout << "\n  中了 " << match << " 位，再接再厉。\n";
        }
        setColor(7);

        if (reward > 0) {
            RMB += reward;
            cout << "  你赢得了 " << reward << " 元!\n";
        }
        cout << "  当前RMB: " << RMB << "\n";
        printLine();
        cout << "  1.再来一次  0.返回\n";
        cout << "  请选择: ";
        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op != 1) break;
    }
}

// ===== 工作系统 =====
void work(int &RMB, int &day) {
    system("cls");
    setColor(14);
    cout << "  === 打工 ===\n";
    setColor(7);
    printLine();

    vector<string> jobs = {"送外卖", "收银员", "家教", "程序员", "经理"};
    vector<int> pays = {50, 80, 120, 200, 350};

    for (int i = 0; i < 5; i++) {
        cout << "  " << i + 1 << ". " << jobs[i]
             << "  薪资: " << pays[i] << " 元\n";
    }
    cout << "  0. 返回\n";
    printLine();
    cout << "  你的RMB: " << RMB << "\n";
    cout << "  请选择: ";

    int op;
    if (!(cin >> op)) { cin.clear(); cin.ignore(); return; }
    if (op >= 1 && op <= 5) {
        int idx = op - 1;
        RMB += pays[idx];
        cout << "  你做了" << jobs[idx] << "，赚了 " << pays[idx] << " 元!\n";
        day++;
        cout << "  天数推进到第 " << day << " 天\n";
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
        cout << "  === 银行 ===\n";
        setColor(7);
        printLine();
        cout << "  现金:     " << RMB << " 元\n";
        cout << "  存款:     " << deposit << " 元\n";
        cout << "  可领利息: " << (int)(deposit * rate) << " 元(5%)\n";
        printLine();
        cout << "  1.存款  2.取款  3.领取利息  0.返回\n";
        cout << "  请选择: ";

        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) break;
        if (op == 1) {
            cout << "  存款金额: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > RMB) { cout << "  无效金额!\n"; Sleep(1000); continue; }
            RMB -= amt;
            deposit += amt;
            cout << "  已存入 " << amt << " 元\n";
            Sleep(1000);
        } else if (op == 2) {
            cout << "  取款金额: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > deposit) { cout << "  无效金额!\n"; Sleep(1000); continue; }
            deposit -= amt;
            RMB += amt;
            cout << "  已取出 " << amt << " 元\n";
            Sleep(1000);
        } else if (op == 3) {
            int interest = deposit * rate;
            if (interest <= 0) { cout << "  没有利息可领!\n"; Sleep(1000); continue; }
            RMB += interest;
            deposit += interest; // 复利
            cout << "  已领取 " << interest << " 元利息!\n";
            Sleep(1000);
        }
    }
}

signed main() {
    srand((unsigned int)time(NULL));
    int RMB = 1000;
    int day = 1;

    system("title 搬鱼游戏");

    // 开场
    system("cls");
    setColor(14);
    cout << "\n  搬鱼游戏\n";
    setColor(11);
    cout << "  scirco.(R)\n\n";
    setColor(7);
    cout << "  初始资金 1000 元...\n";
    Sleep(2000);

    while (1) {
        if (RMB < 0) {
            system("cls");
            setColor(12);
            cout << "\n  *** 你破产了! ***\n\n";
            setColor(7);
            cout << "  你存活了 " << day << " 天。\n";
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
                cout << "  再见!\n";
                return 0;
            default: break;
        }
    }
    return 0;
}
