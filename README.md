## regen-faucet

### Proxy

nginx.conf

```	
location /api/ {
		add_header "Access-Control-Allow-Origin"  '*' always;

		if ($request_method = 'OPTIONS' ) {
			add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
			add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
			add_header 'Access-Control-Max-Age' 1728000;
			add_header 'Content-Type' 'text/plain; charset=utf-8';
			add_header 'Content-Length' 0;
			return 204;
		}
		proxy_pass http://x.x.x.x:3001/;
}
```
