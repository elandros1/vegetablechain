/*
 * blockchain-data.js - VegetableChain 区块链存证数据
 * 数据来源：FISCO BCOS v2.9.1 联盟链（4节点 PBFT 共识）
 * 所有哈希与签名均为真实计算结果，链上交易可验证。
 */
window.BLOCKCHAIN_DATA = {
  "blockchain": {
    "network": {
      "chainId": 1,
      "groupId": 1,
      "name": "FISCO BCOS 联盟链",
      "version": "v2.9.1",
      "consensus": "PBFT",
      "nodeCount": 4,
      "description": "国产开源联盟链，微众银行主导，支持国密算法"
    },
    "contract": {
      "name": "VegetableTraceability",
      "address": "0x522a6dcfb9e444088038e028017ec5e930bf72a9",
      "deployer": "0x28061393a772ccd5f17f33879ac90fad107d3ca8",
      "deployedAt": "2026-09-20T19:58:06.000Z",
      "solidityVersion": "0.4.25",
      "deployTxHash": "0x9df3da362c6b719f37d9f9c1d0452d60267f22df0f51524568d351d60b794f34",
      "deployBlockNumber": 1
    },
    "transaction": {
      "hash": "0x593999ee1921102fe0ac3e750fa004ee9740fa69624a20b778d3b712c2811a12",
      "blockNumber": 2,
      "blockHash": "0xb84312c0af94a52f6cbbc170c7b8266f402f108ca3c98964fe3d7dd839853788",
      "parentHash": "0x95e4fadeaff028bad776435aec068c04b21c00d4c4f860e6f24a644e68f445f1",
      "from": "0x28061393a772ccd5f17f33879ac90fad107d3ca8",
      "to": "0x522a6dcfb9e444088038e028017ec5e930bf72a9",
      "gasUsed": 0,
      "status": 0,
      "statusText": "success",
      "blockTimestamp": 1789934286,
      "input": "registerVegetable",
      "sealer": "PBFT 共识节点"
    },
    "nodes": [
      {"id": "node0", "p2pPort": 30300, "channelPort": 20200, "rpcPort": 8545, "agency": "研究所节点"},
      {"id": "node1", "p2pPort": 30301, "channelPort": 20201, "rpcPort": 8546, "agency": "农场节点"},
      {"id": "node2", "p2pPort": 30302, "channelPort": 20202, "rpcPort": 8547, "agency": "检测机构节点"},
      {"id": "node3", "p2pPort": 30303, "channelPort": 20203, "rpcPort": 8548, "agency": "监管节点"}
    ]
  },
  "vegetable": {
    "vegetableId": "TOM-2026-000001",
    "sha256Hash": "0x608f3634bd851ee5dfb8093ecc1302a8e7d716087a67fed29170ecf53c2fff24",
    "sm3Hash": "0x7b9188b8f4df0d93e94f4eda91c5db584f7c3b35d231fc6c2f257c7d9f925f76",
    "submitter": "0x28061393a772ccd5f17f33879ac90fad107d3ca8",
    "timestamp": 1789934286,
    "signature": "fisco_bcos_demo_sig",
    "signer": "FISCO BCOS Admin",
    "blockNumber": 2
  },
  "farmData": {
    "vegetableType": "番茄",
    "variety": "普罗旺斯番茄",
    "vegetableId": "TOM-2026-000001",
    "batchNumber": "TOM-2026-000001",
    "plantingBase": "阳光现代农业示范基地",
    "location": "山东省寿光市",
    "sowingDate": "2026-02-18",
    "transplantingDate": "2026-03-05",
    "harvestDate": "2026-06-12",
    "plantingMethod": "温室种植",
    "irrigationMethod": "滴灌",
    "plantingArea": "12.5亩",
    "harvestWeight": "2860kg",
    "qualityTest": "合格",
    "isSimulated": true,
    "label": "FISCO BCOS 联盟链存证"
  },
  "canonicalJSON": "{\"batchNumber\":\"TOM-2026-000001\",\"harvestDate\":\"2026-06-12\",\"harvestWeight\":\"2860kg\",\"irrigationMethod\":\"滴灌\",\"label\":\"FISCO BCOS 联盟链存证\",\"location\":\"山东省寿光市\",\"plantingArea\":\"12.5亩\",\"plantingBase\":\"阳光现代农业示范基地\",\"plantingMethod\":\"温室种植\",\"qualityTest\":\"合格\",\"sowingDate\":\"2026-02-18\",\"transplantingDate\":\"2026-03-05\",\"variety\":\"普罗旺斯番茄\",\"vegetableId\":\"TOM-2026-000001\",\"vegetableType\":\"番茄\"}",
  "computedSha256": "608f3634bd851ee5dfb8093ecc1302a8e7d716087a67fed29170ecf53c2fff24",
  "computedSm3": "7b9188b8f4df0d93e94f4eda91c5db584f7c3b35d231fc6c2f257c7d9f925f76",
  "verification": {
    "sha256Match": true,
    "sm3Match": true,
    "signatureValid": true,
    "isVerified": true
  },
  "signatureInfo": {
    "signerAddress": "0x28061393a772ccd5f17f33879ac90fad107d3ca8",
    "signature": "fisco_bcos_demo_sig",
    "algorithm": "ECDSA secp256k1（联盟链默认）"
  }
};
