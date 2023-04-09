#include <iostream>
#include <vector>

using namespace std;

const int MAX = 20;

int main() {
    int n, m;
    int allocation[MAX][MAX], max[MAX][MAX], available[MAX];
    int need[MAX][MAX], work[MAX], finish[MAX];
    vector<int> safeSequence;

    cout << "Enter the number of processes: ";
    cin >> n;

    cout << "Enter the number of resources: ";
    cin >> m;

    cout << "Enter the allocation matrix:\n";
    for(int i=0; i<n; i++) {
        for(int j=0; j<m; j++) {
            cin >> allocation[i][j];
        }
    }

    cout << "Enter the max matrix:\n";
    for(int i=0; i<n; i++) {
        for(int j=0; j<m; j++) {
            cin >> max[i][j];
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }

    cout << "Enter the available resources:\n";
    for(int i=0; i<m; i++) {
        cin >> available[i];
        work[i] = available[i];
    }

    for(int i=0; i<n; i++) {
        finish[i] = 0;
    }

    int count = 0;
    while(count < n) {
        bool found = false;
        for(int i=0; i<n; i++) {
            if(finish[i] == 0) {
                int j;
                for(j=0; j<m; j++) {
                    if(need[i][j] > work[j]) {
                        break;
                    }
                }
                if(j == m) {
                    for(int k=0; k<m; k++) {
                        work[k] += allocation[i][k];
                    }
                    safeSequence.push_back(i);
                    finish[i] = 1;
                    found = true;
                    count++;
                }
            }
        }
        if(found == false) {
            cout << "System is in unsafe state.\n";
            return 0;
        }
        
    }

    
    cout << "System is in safe state.\nSafe sequence is: ";
    for(int i=0; i<n; i++) {
         cout << "P" << safeSequence[i];
          if(i != n-1) {
                cout << " -> ";
            }
        }
    
    return 0;
}

