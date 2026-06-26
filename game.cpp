#include <bits/stdc++.h>
#include <windows.h>
#include <conio.h>
#include <cstdio>
#define int long long
using namespace std;

// ===== HTTP 工具 =====
string httpGet(const string& url, const string& referer = "") {
    string cmd = "curl -s --connect-timeout 5 --max-time 10";
    if (!referer.empty()) cmd += " -e \"" + referer + "\"";
    cmd += " \"" + url + "\" 2>nul";
    FILE* pipe = _popen(cmd.c_str(), "r");
    if (!pipe) return "";
    string data;
    char buf[4096];
    while (fgets(buf, sizeof(buf), pipe)) data += buf;
    _pclose(pipe);
    return data;
}

vector<string> splitStr(const string& s, char delim) {
    vector<string> res;
    string cur;
    for (char c : s) {
        if (c == delim) { res.push_back(cur); cur.clear(); }
        else cur += c;
    }
    res.push_back(cur);
    return res;
}

bool curlAvailable = false;
void checkCurl() {
    FILE* pipe = _popen("curl --version 2>nul", "r");
    if (!pipe) { curlAvailable = false; return; }
    char buf[128];
    curlAvailable = (fgets(buf, sizeof(buf), pipe) != NULL);
    _pclose(pipe);
}

// ===== 通用工具 =====
void setColor(int color) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);
}
void printLine() {
    setColor(11);
    cout << "========================================\n";
    setColor(7);
}

void showMenu(int RMB, int day) {
    system("cls");
    setColor(14);
    cout << "  work fish gamessssssssssssssssssss\n";
    setColor(11);
    cout << "  scirco.(R)\n";
    setColor(7);
    printLine();
    setColor(10);
    cout << "  第 " << day << " 天  |  ";
    setColor(14);
    cout << "RMB: " << RMB << "\n";
    setColor(7);
    if (curlAvailable) {
        setColor(10); cout << "  [在线模式]\n"; setColor(7);
    } else {
        setColor(12); cout << "  [离线模式]\n"; setColor(7);
    }
    printLine();
    cout << "  1. 股市 (A股实时行情)\n";
    cout << "  2. 彩票 (双色球)\n";
    cout << "  3. 打工赚钱\n";
    cout << "  4. 银行存取\n";
    cout << "  0. 退出\n";
    printLine();
    cout << "  请选择: ";
}

// ===== 股票系统 =====
struct StockData {
    string sinaCode;  // 新浪代码
    string code;      // 简称
    string name;      // 名称
    double price;     // 当前价
    double lastClose; // 昨收
    double open;      // 今开
    bool valid;       // 数据有效
};

vector<StockData> stocks = {
    {"sh600019", "BG", "宝钢股份", 6.50, 6.48, 6.49, false},
    {"sz000002", "WK", "万科A",    8.00, 7.90, 7.95, false},
    {"sh601988", "ZG", "中国银行",  4.20, 4.18, 4.19, false},
    {"sz000725", "JD", "京东方A",   4.50, 4.45, 4.48, false},
    {"sh600028", "SH", "中国石化",  5.80, 5.75, 5.77, false}
};
map<string, int> hold;
bool stockOnline = false;

void fetchStockData() {
    if (!curlAvailable) { stockOnline = false; return; }
    cout << "  正在获取实时行情..." << flush;

    string url = "http://hq.sinajs.cn/list=";
    for (int i = 0; i < (int)stocks.size(); i++) {
        if (i) url += ",";
        url += stocks[i].sinaCode;
    }
    string data = httpGet(url, "https://finance.sina.com.cn");
    if (data.empty()) {
        stockOnline = false;
        cout << " 离线\n";
        Sleep(500);
        return;
    }

    int idx = 0;
    size_t pos = 0;
    while (idx < (int)stocks.size() && pos < data.size()) {
        size_t q1 = data.find('"', pos);
        if (q1 == string::npos) break;
        size_t q2 = data.find('"', q1 + 1);
        if (q2 == string::npos) break;
        string content = data.substr(q1 + 1, q2 - q1 - 1);
        if (!content.empty()) {
            vector<string> f = splitStr(content, ',');
            if (f.size() >= 6) {
                stocks[idx].name = f[0];
                stocks[idx].open = atof(f[1].c_str());
                stocks[idx].lastClose = atof(f[2].c_str());
                stocks[idx].price = atof(f[3].c_str());
                if (stocks[idx].price <= 0) stocks[idx].price = stocks[idx].lastClose;
                if (stocks[idx].price > 0) stocks[idx].valid = true;
            }
        }
        pos = q2 + 1;
        idx++;
    }
    stockOnline = true;
    cout << " OK!\n";
    Sleep(500);
}

void stockMarket(int &RMB) {
    // 进入时获取一次实时数据
    system("cls");
    fetchStockData();

    while (1) {
        system("cls");
        setColor(14);
        cout << "  === 股市 ===";
        if (stockOnline) { setColor(10); cout << " [实时]"; }
        else { setColor(12); cout << " [离线-随机行情]"; }
        cout << "\n";
        setColor(7);
        printLine();
        cout << "  你的RMB: " << RMB << "\n";
        printLine();
        cout << "  代码   名称      价格     涨跌    涨幅%   持有\n";
        cout << "  -----  --------  ------   ------  ------  ----\n";

        for (int i = 0; i < (int)stocks.size(); i++) {
            double change = stocks[i].price - stocks[i].lastClose;
            double pct = stocks[i].lastClose > 0 ? change / stocks[i].lastClose * 100 : 0;

            cout << "  " << stocks[i].code << "    ";
            // GBK名称可能占位不齐，用\t处理
            cout << stocks[i].name << "\t";
            setColor(14);
            cout << setw(8) << fixed << setprecision(2) << stocks[i].price << "  ";

            if (change > 0) setColor(12);
            else if (change < 0) setColor(10);
            else setColor(7);
            cout << setw(6) << fixed << setprecision(2) << change << "  ";
            cout << setw(6) << fixed << setprecision(2) << pct << "  ";
            setColor(7);
            cout << setw(4) << hold[stocks[i].code] << "\n";
        }

        // 计算持仓市值
        int totalHold = 0;
        for (auto &p : hold) {
            for (auto &s : stocks) {
                if (p.first == s.code) {
                    totalHold += (int)(s.price * p.second);
                    break;
                }
            }
        }
        printLine();
        cout << "  持仓市值: " << totalHold << " 元  总资产: " << RMB + totalHold << " 元\n";
        printLine();
        cout << "  1.买入  2.卖出  3.刷新行情  0.返回\n";
        cout << "  请选择: ";

        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) break;
        if (op == 3) { fetchStockData(); continue; }
        if (op == 1) {
            cout << "  输入代码(如BG WK ZG JD SH): ";
            string code; cin >> code;
            for (auto &c : code) c = toupper(c);
            int idx = -1;
            for (int i = 0; i < (int)stocks.size(); i++)
                if (stocks[i].code == code) idx = i;
            if (idx == -1) { cout << "  无效代码!\n"; Sleep(1000); continue; }
            cout << "  " << stocks[idx].name << " 当前价: " << fixed << setprecision(2) << stocks[idx].price << " 元\n";
            cout << "  买入数量(股): ";
            int amt; cin >> amt;
            if (amt <= 0) { cout << "  无效数量!\n"; Sleep(1000); continue; }
            int cost = (int)(stocks[idx].price * amt);
            if (cost > RMB) { cout << "  余额不足! 需要 " << cost << " 元\n"; Sleep(1000); continue; }
            RMB -= cost;
            hold[code] += amt;
            cout << "  买入 " << amt << " 股 " << stocks[idx].name << "，花费 " << cost << " 元\n";
            Sleep(1000);
        } else if (op == 2) {
            cout << "  输入代码: ";
            string code; cin >> code;
            for (auto &c : code) c = toupper(c);
            int idx = -1;
            for (int i = 0; i < (int)stocks.size(); i++)
                if (stocks[i].code == code) idx = i;
            if (idx == -1 || hold[code] == 0) { cout << "  无持仓!\n"; Sleep(1000); continue; }
            cout << "  " << stocks[idx].name << " 当前价: " << fixed << setprecision(2) << stocks[idx].price << " 元\n";
            cout << "  当前持有 " << hold[code] << " 股\n";
            cout << "  卖出数量(0=全部): ";
            int amt; cin >> amt;
            if (amt == 0) amt = hold[code];
            if (amt <= 0 || amt > hold[code]) { cout << "  无效数量!\n"; Sleep(1000); continue; }
            int revenue = (int)(stocks[idx].price * amt);
            RMB += revenue;
            hold[code] -= amt;
            cout << "  卖出 " << amt << " 股 " << stocks[idx].name << "，获得 " << revenue << " 元\n";
            Sleep(1000);
        }

        // 离线模式下每次操作后随机波动
        if (!stockOnline) {
            for (auto &s : stocks) {
                double pct = (rand() % 61 - 30) / 1000.0; // -3% ~ +3%
                s.lastClose = s.price;
                s.price = max(0.01, s.price * (1 + pct));
            }
        }
    }
}

// ===== 双色球彩票系统 =====
struct SSQDraw {
    int red[6];
    int blue;
    string issue;
    bool valid;
};
SSQDraw latestDraw = {{0}, 0, "", false};
bool lotteryOnline = false;

void fetchLotteryData() {
    if (!curlAvailable) { lotteryOnline = false; return; }
    cout << "  正在获取最新开奖信息..." << flush;
    string url = "https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?gameCode=ssq&pageSize=1&pageNo=1&systemType=PC";
    string data = httpGet(url, "https://www.cwl.gov.cn/");
    if (data.find("\"red\"") != string::npos) {
        // 简单JSON解析
        size_t p = data.find("\"red\"");
        if (p != string::npos) {
            p = data.find("\"", p + 5);
            size_t p2 = data.find("\"", p + 1);
            string reds = data.substr(p + 1, p2 - p - 1);
            vector<string> rv = splitStr(reds, ',');
            for (int i = 0; i < 6 && i < (int)rv.size(); i++)
                latestDraw.red[i] = atoi(rv[i].c_str());
        }
        size_t pb = data.find("\"blue\"");
        if (pb != string::npos) {
            pb = data.find("\"", pb + 6);
            size_t pb2 = data.find("\"", pb + 1);
            latestDraw.blue = atoi(data.substr(pb + 1, pb2 - pb - 1).c_str());
        }
        size_t pi = data.find("\"code\"");
        if (pi != string::npos) {
            pi = data.find("\"", pi + 6);
            size_t pi2 = data.find("\"", pi + 1);
            latestDraw.issue = data.substr(pi + 1, pi2 - pi - 1);
        }
        latestDraw.valid = true;
        lotteryOnline = true;
        cout << " OK!\n";
    } else {
        lotteryOnline = false;
        cout << " 离线\n";
    }
    Sleep(500);
}

void genRandomSSQ(int red[6], int &blue) {
    vector<int> pool;
    for (int i = 1; i <= 33; i++) pool.push_back(i);
    for (int i = 32; i > 0; i--) { int j = rand() % (i+1); swap(pool[i], pool[j]); }
    sort(pool.begin(), pool.begin() + 6);
    for (int i = 0; i < 6; i++) red[i] = pool[i];
    blue = rand() % 16 + 1;
}

void printSSQ(const int red[6], int blue) {
    for (int i = 0; i < 6; i++) {
        setColor(12);
        cout << setw(2) << red[i] << " ";
    }
    setColor(9);
    cout << "| " << setw(2) << blue;
    setColor(7);
}

// 计算中奖等级 (1-6等, 0=未中)
int calcSSQLevel(const int myRed[6], int myBlue, const int prRed[6], int prBlue) {
    int redMatch = 0, blueMatch = (myBlue == prBlue) ? 1 : 0;
    for (int i = 0; i < 6; i++)
        for (int j = 0; j < 6; j++)
            if (myRed[i] == prRed[j]) { redMatch++; break; }
    if (redMatch == 6 && blueMatch) return 1;
    if (redMatch == 6) return 2;
    if (redMatch == 5 && blueMatch) return 3;
    if (redMatch == 5 || (redMatch == 4 && blueMatch)) return 4;
    if (redMatch == 4 || (redMatch == 3 && blueMatch)) return 5;
    if (blueMatch) return 6;
    return 0;
}

int ssqPrize(int level) {
    switch(level) {
        case 1: return 5000000;
        case 2: return 200000;
        case 3: return 3000;
        case 4: return 200;
        case 5: return 10;
        case 6: return 5;
        default: return 0;
    }
}

string ssqLevelName(int level) {
    switch(level) {
        case 1: return "一等奖";
        case 2: return "二等奖";
        case 3: return "三等奖";
        case 4: return "四等奖";
        case 5: return "五等奖";
        case 6: return "六等奖";
        default: return "未中奖";
    }
}

void lottery(int &RMB) {
    int cost = 2; // 双色球每注2元
    // 进入时获取最新开奖
    system("cls");
    fetchLotteryData();

    while (1) {
        if (RMB < cost) {
            setColor(12);
            cout << "  余额不足! 每注 " << cost << " 元\n";
            setColor(7);
            Sleep(1500);
            return;
        }

        system("cls");
        setColor(14);
        cout << "  === 双色球彩票 ===";
        if (lotteryOnline) { setColor(10); cout << " [在线]"; }
        else { setColor(12); cout << " [离线]"; }
        cout << "\n";
        setColor(7);
        printLine();
        cout << "  你的RMB: " << RMB << "  每注: " << cost << " 元\n";

        // 显示最新开奖参考
        if (latestDraw.valid) {
            setColor(11);
            cout << "  最新开奖(" << latestDraw.issue << "期): ";
            printSSQ(latestDraw.red, latestDraw.blue);
            cout << "\n";
            setColor(7);
        }
        printLine();

        // 选号方式
        cout << "  1.机选  2.自选  0.返回\n";
        cout << "  请选择: ";
        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) break;

        int myRed[6], myBlue;
        if (op == 2) {
            // 自选
            cout << "  输入6个红球(1-33,用空格分隔): ";
            bool valid = true;
            for (int i = 0; i < 6; i++) {
                if (!(cin >> myRed[i])) { cin.clear(); cin.ignore(); valid = false; break; }
                if (myRed[i] < 1 || myRed[i] > 33) { valid = false; }
            }
            if (!valid) { cout << "  输入无效!\n"; Sleep(1000); continue; }
            // 检查重复
            for (int i = 0; i < 6 && valid; i++)
                for (int j = i+1; j < 6 && valid; j++)
                    if (myRed[i] == myRed[j]) valid = false;
            if (!valid) { cout << "  红球不能重复!\n"; Sleep(1000); continue; }
            sort(myRed, myRed + 6);
            cout << "  输入1个蓝球(1-16): ";
            if (!(cin >> myBlue) || myBlue < 1 || myBlue > 16) {
                cout << "  输入无效!\n"; Sleep(1000); continue;
            }
        } else {
            genRandomSSQ(myRed, myBlue);
        }

        RMB -= cost;

        // 开奖 (随机生成当期号码)
        int prRed[6], prBlue;
        genRandomSSQ(prRed, prBlue);

        // 显示结果
        cout << "\n  你的号码: ";
        printSSQ(myRed, myBlue);
        cout << "\n  开奖号码: ";
        printSSQ(prRed, prBlue);
        cout << "\n\n";

        int level = calcSSQLevel(myRed, myBlue, prRed, prBlue);
        int reward = ssqPrize(level);

        if (level > 0) {
            RMB += reward;
            setColor(14);
            cout << "  *** " << ssqLevelName(level) << "! ***\n";
            cout << "  奖金: " << reward << " 元!\n";
            setColor(7);
        } else {
            setColor(7);
            cout << "  未中奖，再接再厉!\n";
        }
        cout << "  当前RMB: " << RMB << "\n";
        printLine();
        cout << "  1.再来  0.返回\n";
        cout << "  请选择: ";
        int op2;
        if (!(cin >> op2)) { cin.clear(); cin.ignore(); continue; }
        if (op2 != 1) break;
    }
}

// ===== 打工系统 =====
// 薪资参考2024年中国各行业日均收入
void work(int &RMB, int &day) {
    system("cls");
    setColor(14);
    cout << "  === 打工 ===\n";
    setColor(7);
    printLine();

    vector<string> jobs = {"外卖员", "收银员", "家教", "程序员", "经理"};
    vector<int> pays = {180, 130, 250, 450, 800};
    vector<string> refs = {"~200/天", "~130/天", "~200-300/天", "~400-800/天", "~600-1500/天"};

    for (int i = 0; i < 5; i++) {
        cout << "  " << i + 1 << ". " << jobs[i]
             << "  薪资: " << pays[i] << " 元" << refs[i] << "\n";
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
// 利率参考中国人民银行2024年基准利率
void bank(int &RMB) {
    static int deposit = 0;        // 活期存款
    static int fixed1y = 0;        // 一年定期
    static int fixed3y = 0;        // 三年定期
    static int daysSinceFixed1 = 0;
    static int daysSinceFixed3 = 0;

    // 真实利率(年化): 活期0.20%, 一年定期1.45%, 三年定期1.95%
    // 游戏中每天按日计息(年利率/365)
    double rateCurrent  = 0.20 / 100.0 / 365.0;
    double rate1y       = 1.45 / 100.0 / 365.0;
    double rate3y       = 1.95 / 100.0 / 365.0;

    while (1) {
        system("cls");
        setColor(14);
        cout << "  === 银行 ===\n";
        setColor(7);
        printLine();
        cout << "  现金:       " << RMB << " 元\n";
        cout << "  活期存款:   " << deposit << " 元 (年利率0.20%)\n";
        cout << "  一年定期:   " << fixed1y << " 元 (年利率1.45% 已存" << daysSinceFixed1 << "天)\n";
        cout << "  三年定期:   " << fixed3y << " 元 (年利率1.95% 已存" << daysSinceFixed3 << "天)\n";
        printLine();

        // 计算利息
        int interestCurrent = (int)(deposit * rateCurrent);
        int interest1y = (int)(fixed1y * rate1y);
        int interest3y = (int)(fixed3y * rate3y);
        cout << "  活期可领利息: " << interestCurrent << " 元\n";
        cout << "  定期到期后领本息\n";
        cout << "  (一年定期存满30天到期, 三年定期存满90天到期)\n";
        printLine();
        cout << "  1.存活期  2.取活期  3.存一年定期  4.存三年定期\n";
        cout << "  5.领活期利息  6.定期到期取款  0.返回\n";
        cout << "  请选择: ";

        int op;
        if (!(cin >> op)) { cin.clear(); cin.ignore(); continue; }
        if (op == 0) {
            // 每次离开银行, 推进定期天数
            daysSinceFixed1++;
            daysSinceFixed3++;
            break;
        }
        if (op == 1) {
            cout << "  存款金额: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > RMB) { cout << "  无效金额!\n"; Sleep(1000); continue; }
            RMB -= amt; deposit += amt;
            cout << "  已存入活期 " << amt << " 元\n"; Sleep(1000);
        } else if (op == 2) {
            cout << "  取款金额: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > deposit) { cout << "  无效金额!\n"; Sleep(1000); continue; }
            deposit -= amt; RMB += amt;
            cout << "  已取出 " << amt << " 元\n"; Sleep(1000);
        } else if (op == 3) {
            cout << "  存入金额: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > RMB) { cout << "  无效金额!\n"; Sleep(1000); continue; }
            RMB -= amt; fixed1y += amt; daysSinceFixed1 = 0;
            cout << "  已存一年定期 " << amt << " 元\n"; Sleep(1000);
        } else if (op == 4) {
            cout << "  存入金额: ";
            int amt; cin >> amt;
            if (amt <= 0 || amt > RMB) { cout << "  无效金额!\n"; Sleep(1000); continue; }
            RMB -= amt; fixed3y += amt; daysSinceFixed3 = 0;
            cout << "  已存三年定期 " << amt << " 元\n"; Sleep(1000);
        } else if (op == 5) {
            int interest = (int)(deposit * rateCurrent);
            if (interest <= 0) { cout << "  没有利息可领!\n"; Sleep(1000); continue; }
            RMB += interest;
            cout << "  已领取活期利息 " << interest << " 元\n"; Sleep(1000);
        } else if (op == 6) {
            bool got = false;
            if (daysSinceFixed1 >= 30 && fixed1y > 0) {
                int total = fixed1y + (int)(fixed1y * rate1y * 30);
                RMB += total;
                cout << "  一年定期到期! 本息共 " << total << " 元\n";
                fixed1y = 0; daysSinceFixed1 = 0;
                got = true;
            }
            if (daysSinceFixed3 >= 90 && fixed3y > 0) {
                int total = fixed3y + (int)(fixed3y * rate3y * 90);
                RMB += total;
                cout << "  三年定期到期! 本息共 " << total << " 元\n";
                fixed3y = 0; daysSinceFixed3 = 0;
                got = true;
            }
            if (!got) {
                cout << "  没有到期的定期存款\n";
                if (fixed1y > 0) cout << "  一年定期还需 " << 30 - daysSinceFixed1 << " 天\n";
                if (fixed3y > 0) cout << "  三年定期还需 " << 90 - daysSinceFixed3 << " 天\n";
            }
            Sleep(1500);
        }
    }
}

signed main() {
    srand((unsigned int)time(NULL));
    checkCurl();

    int RMB = 1000;
    int day = 1;

    system("title work fish gamessssssssssssssssssss");

    system("cls");
    setColor(14);
    cout << "\n  work fish gamessssssssssssssssssss\n";
    setColor(11);
    cout << "  scirco.(R)\n\n";
    setColor(7);
    if (curlAvailable) {
        setColor(10);
        cout << "  检测到网络, 已启用在线模式!\n";
        cout << "  股市: A股实时行情 | 彩票: 双色球真实开奖\n";
    } else {
        setColor(12);
        cout << "  未检测到curl, 使用离线模式\n";
    }
    setColor(7);
    cout << "  初始资金 1000 元...\n";
    Sleep(3000);

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
