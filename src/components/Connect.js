import React, { useState, useEffect } from 'react'
import { AE_AMOUNT_FORMATS } from '@aeternity/aepp-sdk'
import useAeternitySDK from '../Scripts/useAeternitySDK'

//networkId
const Connect = () => {
    const { aeSdk, connectToWallet, address, getBalance } = useAeternitySDK();
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(null);
    const [spendTo, setSpendTo] = useState('');
    const [spendAmount, setSpendAmount] = useState('');
    const [thankYouVisible, setThankYouVisible] = useState(false);
    const [noAmount, setnoAmount] = useState(false);


    let aci = [
        {
            "contract": {
                "functions": [
                    {
                        "arguments": [],
                        "name": "init",
                        "payable": false,
                        "returns": "CharityTransfer.state",
                        "stateful": false
                    },
                    {
                        "arguments": [],
                        "name": "sendMoney",
                        "payable": true,
                        "returns": {
                            "tuple": []
                        },
                        "stateful": true
                    },
                    {
                        "arguments": [],
                        "name": "getContractDetails",
                        "payable": false,
                        "returns": "CharityTransfer.state",
                        "stateful": false
                    }
                ],
                "kind": "contract_main",
                "name": "CharityTransfer",
                "payable": true,
                "state": {
                    "record": [
                        {
                            "name": "user1",
                            "type": "address"
                        },
                        {
                            "name": "user2",
                            "type": "address"
                        },
                        {
                            "name": "amount",
                            "type": "int"
                        },
                        {
                            "name": "isConfirmed",
                            "type": "bool"
                        }
                    ]
                },
                "typedefs": []
            }
        }
    ];
    let bytecode =
        "cb_+QE0RgOg9VJwCt/1bunq4G0DoMIjvwztRQHnOmS4btUFfbgIcyPAuQEGuM3+Dv7QsgA3ADcERwBHAAcXDAKCDAKEDAKGDAKIJwwIAP5E1kQfADcANwBVAoIaDoSfAKDV2POv3jVbFg8fneTzQzjhJ42+W4ZvmRZh17lUxKBJaxoOhgAaDoh/AQM//qGAQw0ENwA3ACYIiAcMBPsDpVRyYW5zYWN0aW9uIGFscmVhZHkgY29uZmlybWVkIG9yIHJlamVjdGVkCwAfMAAHDAj7A31BbW91bnQgc2hvdWxkIGJlIGdyZWF0ZXIgdGhhbiAwCwAUCoaGAQM/sy8DEQ7+0LJJZ2V0Q29udHJhY3REZXRhaWxzEUTWRB8RaW5pdBGhgEMNJXNlbmRNb25leYIvAIU3LjQuMAFOSKJN";



    useEffect(() => {
        const fetchBalance = async () => {
            try {
                setSpendTo('ak_2QaAzpW4w4pnPNDdrgdLHu5v4bGMxVzUD2F16X3aUrayPcBzZm');
                const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });
                setBalance(balance);
            } catch (error) {
                console.error(error.message);
            }
        };

        if (address) {
            fetchBalance();
        }
    }, [aeSdk, address, getBalance]);


    const updateBalance = async () => {
        const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });
        setBalance(balance);
    }


    const handleConnectClick = async () => {
        setIsLoading(true);
        try {
            await connectToWallet();
        } catch (error) {
            if (!(error instanceof Error)) throw error;
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }


    };
    const get = async () => {
        const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });

        setBalance(balance);

    }

    const handleSpendClick = async () => {
        try {
            console.log(spendAmount, spendTo);
            const contract = await aeSdk.initializeContract({ aci, bytecode, address: "ct_VAVZxayCvmd163vQGpGrNRmaZLfVMbRHnxSVAuwovGEDCjBCs" })
            console.log("contract", contract);


            // const sendMoneyResult = await contract.sendMoney("ak_cgWc8Rs7UcrmRu7VMXBCsG3mMaAKMmAnKgPWsWby5S5C5rhc3");
            // console.log(sendMoneyResult);
            const options1 = {
                amount: spendAmount * 1000000000000000000,
                callData: "",
                fee: null,
                gas: null,
                gasPrice: 1000000000,
            };
            const args = [];
            const options = Object.fromEntries(
                Object.entries(options1).filter(([, v]) => v != null),
            );

            contract
                ?.$call("sendMoney", args, options)
                .then((result) => {
                    console.log(result);
                    // setSpendPromise(result.hash)
                    get()
                    setSpendAmount('')
                    setThankYouVisible(true)
                    setTimeout(() => setThankYouVisible(false), 5000);
                    console.log(result);

                });

            // const result = await aeSdk.spend(spendAmount * 1000000000000000000, spendTo);


        } catch (error) {
            console.error(error.message);
            setThankYouVisible(false)
        }
    };


    return (
        <>
            <div >
                {address ? (
                    <React.Fragment>


                        <div className='fixed top-60 right-40 p-4 rounded-lg shadow-md w-64 bg-white
                flex flex-col items-start slide-in-left'>
                            <div>
                                <label
                                    className='text-black mb-4 text-left w-full'
                                >Balance: {balance}</label>
                            </div>


                            <div className='mt-4 pt-4'>
                                <label
                                    className='text-black mb-2 text-left w-full pb-4'
                                >Amount:</label>
                                <input
                                    className='mb-4 p-2 rounded-lg border-2 border-blue-500 w-full'
                                    type='text'
                                    placeholder='Enter amount'
                                    value={spendAmount}
                                    onChange={(e) => { setSpendAmount(e.target.value) }}
                                />
                            </div>
                            {thankYouVisible && (
                                <div className="text-black-500 mb-4">
                                    Thank you for your Support!
                                </div>
                            )}

                            {noAmount && (
                                <div className="text-red-500 mb-4">
                                    Amount must be greator than 0
                                </div>
                            )}

                            <div>
                                <button variant="contained" disabled={isLoading}
                                    onClick={() => {
                                        if (spendAmount) {
                                            handleSpendClick()
                                        }
                                        else {
                                            setnoAmount(true);
                                            setTimeout(() => setnoAmount(false), 5000);
                                        }
                                    }}
                                >
                                    Transact
                                </button>
                            </div>

                        </div>

                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className='flex flex-row-reverse ...'>


                            <button 
                            className='text-white bg-blue-900 hover:bg-blue-800 inline-flex items-center justify-center w-auto px-6 py-3 shadow-xl rounded-xl'
                            variant="contained" onClick={handleConnectClick} disabled={isLoading}>
                                {isLoading ? 'Connecting…' : <p>Show Support to this Website &hearts;</p>}
                            </button>

                        </div>
                        {isLoading}
                    </React.Fragment>
                )}
            </div>
        </>
    );
};

export default Connect;