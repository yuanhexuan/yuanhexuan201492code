#include <bits/stdc++.h>
#include <windows.h>
#include <conio.h>
#include <cstdio>
#define int long long
using namespace std;

// ===== HTTP 宸ュ叿 =====
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

// ===== 閫氱敤宸ュ叿 =====
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
    cout << "  绗