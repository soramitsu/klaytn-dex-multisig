import { getMultisigContract } from '../utils/contractHelper'

export const getTransactions = async () => {
    const multiSign = getMultisigContract();
    const pendingCount = await multiSign.methods.getTransactionCount(true, false).call()
    const execCount = await multiSign.methods.getTransactionCount(false, true).call()
    const required = await multiSign.methods.required().call()

    console.log({ pendingCount, execCount })

    const pendingTrIds = await multiSign.methods.getTransactionIds(0, pendingCount, true, false).call()
    const execTrIds = await multiSign.methods.getTransactionIds(0, execCount, false, true).call()

    console.log({ pendingTrIds, execTrIds })

    const pendingTempData = (await Promise.all(pendingTrIds
        .filter((id, index) => (id === 0 && index === 0) || id !== 0)
        .map(async (id) => {
            return {
                transaction: await multiSign.methods.getTransactionInfo(id).call(),
                voted: await multiSign.methods.getConfirmations(id).call(),
                id
            }
        })))

    const executed = await Promise.all(execTrIds
        .filter((id, index) => (id === 0 && index === 0) || id !== 0)
        .map(async (id) => {
            return {
                transaction: await multiSign.methods.getTransactionInfo(id).call(),
                voted: await multiSign.methods.getConfirmations(id).call(),
                id
            }
        }))
    const failed = pendingTempData.filter((id) => (id.transaction.executed_ === false && id.transaction.votesLength_ >= required));
    const pending = pendingTempData.filter((id) => (id.transaction.executed_ === false && id.transaction.votesLength_ < required));
    console.log({ pending, executed, failed })
    return { failed, executed, pending }
}