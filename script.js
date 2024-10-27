const serverlist = 'https://servers.minetest.net/list'

async function update_banner() {
    try {
        var serverg
        const response = await fetch(serverlist);
        const data = await response.json();

        console.log(data);

        var MAX_Pcount = 0;

        data.list.forEach(server => {
            MAX_Pcount = MAX_Pcount + server.clients_max;
        });


        var cc = document.createElement('txt');
        cc.style.color = 'lightgreen';
        cc.innerHTML = data.total.clients;

        document.getElementById('Playercount').innerHTML = ""
        document.getElementById('Playercount').appendChild(cc);
        document.getElementById('Playercount').innerHTML = document.getElementById('Playercount').innerHTML + " of " + MAX_Pcount;

        document.getElementById('Servercount').innerHTML = " " + data.total.servers;

        document.getElementById('highest').innerHTML = "Servers: " + data.total_max.servers + ", Players: " + data.total_max.clients;

        document.getElementById('title').style.color = 'lightgreen';

    } catch (error) {
        console.log('Error fetching data:' + error);
        document.getElementById('title').style.color = 'red';
        document.getElementById('Playercount').innerHTML = `No. of players online: N/A`;
    }
}



async function find_player(pname_o) {
    var pname = pname_o.toLowerCase()
    try {
        const response = await fetch(serverlist);
        const data = await response.json();

        var ss = false;
        var ss_l = [];

        if (pname.startsWith("[server]")) {
            pname = pname.replace("[server]", "").trim();
            ss = true;
        }

        var found = false;
        var Playercount = 0;
        var Servercount = 0;
        var ServerMcount = 0;
        const results = document.getElementById('results');

        var res = [];
        var res_e = [];

        data.list.forEach(server => {
            Servercount++;
            var serverm = false;
            if (Array.isArray(server.clients_list)) {
                if (ss) {
                    if (server.name.toLowerCase().includes(pname)) {
                        Playercount += server.clients_list.length;
                        found = true;
                        ServerMcount++;
                        ss_l.push([server.name, server.clients_list])
                    }
                }
                else if (!(server.clients_list.length === 0)) {
                    
                    server.clients_list.forEach(player => {
                        Playercount++;
                        if (pname == "*") {
                            found = true;
                            res.push([player, server.name]);
                            if (serverm == false) {
                                serverm = true;
                                ServerMcount++;
                            }
                        }
                        if (player.toLowerCase().includes(pname)) {
                            if (serverm == false) {
                                serverm = true;
                                ServerMcount++;
                            }
                            found = true;
                            if (player == pname_o)
                                res_e.push([player, server.name]);
                            else
                                res.push([player, server.name]);
                        }
                    });
                }
            }
        });

        if (ss) {
            results.innerHTML = "";
            var next
            if (found)
                next = document.createElement('seachinfogood');
            else
                next = document.createElement('seachinfobad');

            next.textContent = "[Searched " + Servercount + " servers: results in " + ServerMcount + ", searched " + Playercount + " players: " + Playercount + " matches found]";
            results.appendChild(next);

            ss_l.forEach(([n, l]) => {
                var next_m = document.createElement('h3');
                var next_m1 = document.createElement('lightgreen-text');
                next_m1.textContent = "Found: " + n;
                next_m.appendChild(next_m1);
                results.appendChild(next_m);
                l.forEach(e => {
                    var next = document.createElement('li');
                    next.textContent = e;
                    next_m.appendChild(next);
                });
            });
        }
        else if (!ss) {
            if (pname != "*") {
                for (let i = 0; i < res.length; i++) {
                    for (let j = 0; j < res.length - 1; j++) {
                        var n = res[j+1][0]
                        let temp = res[j];
                        if (n.toLowerCase().startsWith(pname) && res[j][0].toLowerCase() != pname) {
                            res[j] = res[j + 1];
                            res[j + 1] = temp;
                        }
                    }
                }

                res = res_e.concat(res)
            }
            else {
                res.reverse()
            }
            
            
            results.innerHTML = "";
            var next
            if (found)
                next = document.createElement('seachinfogood');
            else
                next = document.createElement('seachinfobad');

            next.textContent = "[Searched " + Servercount + " servers: results in " + ServerMcount + ", searched " + Playercount + " players: " + res.length + " matches found]";
            results.appendChild(next);

            if (found) {
                results.innerHTML += "\n";
            }
            
            res.forEach(e => {
                var next = document.createElement('li');
                next.textContent = "Found " + e[0] + ", on " + e[1];
                results.appendChild(next);
            });
        }
        
    } catch (error) {
        console.log('Error fetching data:' + error);
    }
}

